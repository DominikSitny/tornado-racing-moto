'use client';

import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

/*
 * "So läuft eine Anfrage" as a speedway lap.
 * The oval is split into one segment per step. When the track scrolls into view,
 * a speedway bike (seen from above) rides the lap anti-clockwise, broadsliding through
 * the bends; each segment and its step light up; at the line a chequered flag appears.
 */

// ---- Track geometry (viewBox 0 0 400 520), centre line of a vertical stadium oval ----
const CX = 200;
const R = 100; // bend radius of the centre line
const TOP = 160; // centre of the top bend
const BOTTOM = 360; // centre of the bottom bend
const STRAIGHT = BOTTOM - TOP; // 200
const HALF = STRAIGHT / 2; // start/finish sits in the middle of the home straight
const BEND = Math.PI * R;
const LAP = 2 * STRAIGHT + 2 * BEND;
const START_Y = TOP + HALF; // 260
const TRACK_WIDTH = 54;
const INNER = R - TRACK_WIDTH / 2; // inner kerb radius
const OUTER = R + TRACK_WIDTH / 2; // fence radius

// Bend ranges along the lap (distance from the line)
const BEND1 = [HALF, HALF + BEND] as const;
const BEND2 = [HALF + BEND + STRAIGHT, HALF + 2 * BEND + STRAIGHT] as const;

const COLORS = {
  dirt: '#8a5a3b',
  dirtLight: '#b07c55',
  dirtDark: '#5f3a24',
  grass: '#4b7a37',
  grassLight: '#568a40',
  fence: '#001f3f',
  red: '#dc2626',
};

/** Round to 2 decimals: server and browser can differ in the last digit of Math.cos/sin,
 *  which would otherwise cause a React hydration mismatch. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function rawPointAt(distance: number) {
  let s = ((distance % LAP) + LAP) % LAP;
  if (s < HALF) return { x: CX + R, y: START_Y - s }; // home straight, upwards
  s -= HALF;
  if (s < BEND) {
    const t = s / R; // top bend, right → left
    return { x: CX + R * Math.cos(t), y: TOP - R * Math.sin(t) };
  }
  s -= BEND;
  if (s < STRAIGHT) return { x: CX - R, y: TOP + s }; // back straight, downwards
  s -= STRAIGHT;
  if (s < BEND) {
    const t = s / R; // bottom bend, left → right
    return { x: CX - R * Math.cos(t), y: BOTTOM + R * Math.sin(t) };
  }
  s -= BEND;
  return { x: CX + R, y: BOTTOM - s }; // home straight again, up to the line
}

/** Point on the centre line after distance s (0 = start/finish, anti-clockwise). */
function pointAt(distance: number) {
  const p = rawPointAt(distance);
  return { x: r2(p.x), y: r2(p.y) };
}

/** 0 on the straights, rising to 1 in the middle of a bend (smooth entry and exit). */
function bendWeight(distance: number) {
  const s = ((distance % LAP) + LAP) % LAP;
  for (const [a, b] of [BEND1, BEND2]) {
    if (s >= a && s <= b) return Math.sin((Math.PI * (s - a)) / (b - a));
  }
  return 0;
}

/** Heading of the bike in degrees (0 = nose up), incl. the broadslide angle in bends. */
function headingAt(distance: number) {
  const a = rawPointAt(distance);
  const b = rawPointAt(distance + 0.5);
  const tangent = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
  return r2(tangent - 24 * bendWeight(distance)); // nose turned into the bend
}

// The lap as an SVG path that starts on the finish line, so dash offsets map to distance.
const LAP_PATH = [
  `M ${CX + R} ${START_Y}`,
  `L ${CX + R} ${TOP}`,
  `A ${R} ${R} 0 0 0 ${CX - R} ${TOP}`,
  `L ${CX - R} ${BOTTOM}`,
  `A ${R} ${R} 0 0 0 ${CX + R} ${BOTTOM}`,
  `L ${CX + R} ${START_Y}`,
].join(' ');

/** Closed stadium outline with bend radius r (r = R ± offset gives exact parallel edges). */
const stadium = (r: number) =>
  `M ${CX + r} ${START_Y} L ${CX + r} ${TOP} A ${r} ${r} 0 0 0 ${CX - r} ${TOP} L ${CX - r} ${BOTTOM} A ${r} ${r} 0 0 0 ${CX + r} ${BOTTOM} Z`;

const LAP_DURATION_MS = 4600;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ---------------------------------------------------------------------------
// Static artwork: dirt track, infield, fence, start gate (drawn once)
// ---------------------------------------------------------------------------
const TrackArt = memo(function TrackArt({ uid }: { uid: string }) {
  const grain = `grain-${uid}`;
  const grass = `grass-${uid}`;
  // Tyre ruts: several lines at different radii, broken up irregularly
  const ruts = [
    { r: INNER + 7, dash: '70 8 30 5 110 12', w: 1.6, o: 0.45 },
    { r: INNER + 12, dash: '50 10 90 6 40 14', w: 1.2, o: 0.35 },
    { r: INNER + 17, dash: '120 15 35 8', w: 1, o: 0.3 },
    { r: R + 4, dash: '30 18 60 12', w: 0.9, o: 0.22 },
  ];

  return (
    <>
      <defs>
        {/* fine grit of a shale / granite surface */}
        <filter id={grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.22  0 0 0 0 0.13  0 0 0 0 0.07  0 0 0 2.4 -1.25"
            result="specks"
          />
          <feComposite in="specks" in2="SourceGraphic" operator="in" />
        </filter>
        {/* mowing stripes in the infield */}
        <pattern id={grass} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={COLORS.grass} />
          <rect width="12" height="24" fill={COLORS.grassLight} />
        </pattern>
      </defs>

      {/* infield */}
      <path d={stadium(INNER)} fill={`url(#${grass})`} />

      {/* dirt surface */}
      <path d={LAP_PATH} fill="none" stroke={COLORS.dirt} strokeWidth={TRACK_WIDTH} />
      {/* loose, lighter dirt pushed to the fence (the "cushion") */}
      <path d={stadium(OUTER - 7)} fill="none" stroke={COLORS.dirtLight} strokeWidth="12" strokeOpacity="0.55" />
      {/* darker, compacted racing line near the inside */}
      <path d={stadium(INNER + 11)} fill="none" stroke={COLORS.dirtDark} strokeWidth="16" strokeOpacity="0.28" />
      {/* grit texture over the whole surface */}
      <path d={LAP_PATH} fill="none" stroke="#000" strokeWidth={TRACK_WIDTH} filter={`url(#${grain})`} />
      {/* tyre ruts */}
      {ruts.map((rut, i) => (
        <path
          key={i}
          d={stadium(rut.r)}
          fill="none"
          stroke={COLORS.dirtDark}
          strokeWidth={rut.w}
          strokeOpacity={rut.o}
          strokeDasharray={rut.dash}
          strokeDashoffset={i * 37}
        />
      ))}

      {/* white inner kerb */}
      <path d={stadium(INNER)} fill="none" stroke="#ffffff" strokeWidth="3" />
      {/* fence with posts */}
      <path d={stadium(OUTER + 3)} fill="none" stroke={COLORS.fence} strokeWidth="6" />
      <path d={stadium(OUTER + 3)} fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="1.5 22" strokeOpacity="0.8" />

      {/* start gate: tapes just behind the line */}
      <line x1={CX + INNER} x2={CX + OUTER} y1={START_Y + 14} y2={START_Y + 14} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="5 2" />
      <rect x={CX + INNER - 3} y={START_Y + 11} width="4" height="6" fill={COLORS.fence} />
      <rect x={CX + OUTER - 1} y={START_Y + 11} width="4" height="6" fill={COLORS.fence} />

      {/* chequered finish line */}
      <g transform={`translate(${CX + INNER} ${START_Y - 4})`}>
        {Array.from({ length: 2 }).map((_, row) =>
          Array.from({ length: 12 }).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={(col * TRACK_WIDTH) / 12}
              y={row * 4}
              width={TRACK_WIDTH / 12}
              height={4}
              fill={(row + col) % 2 === 0 ? '#111827' : '#ffffff'}
            />
          ))
        )}
      </g>
    </>
  );
});

// ---------------------------------------------------------------------------
// Speedway bike seen from above, nose pointing up (−y) before rotation
// ---------------------------------------------------------------------------
function SpeedwayBike({ x, y, heading, slide, moving }: { x: number; y: number; heading: number; slide: number; moving: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${heading})`}>
      {/* dirt thrown up behind the rear wheel, to the outside of the bend */}
      {moving && slide > 0.15 && (
        <g className="race-spray" opacity={Math.min(1, slide * 1.3)}>
          <circle cx="7" cy="30" r="3.4" fill={COLORS.dirtLight} />
          <circle cx="13" cy="34" r="2.6" fill={COLORS.dirt} />
          <circle cx="4" cy="37" r="2.1" fill={COLORS.dirtLight} />
          <circle cx="17" cy="28" r="1.7" fill={COLORS.dirt} />
          <circle cx="10" cy="41" r="1.5" fill={COLORS.dirtDark} />
        </g>
      )}

      {/* shadow */}
      <ellipse cx="2.5" cy="2" rx="8" ry="27" fill="#000" opacity="0.2" />

      {/* front wheel and fork */}
      <rect x="-2.6" y="-31" width="5.2" height="14" rx="2.6" fill="#111827" />
      <rect x="-1.3" y="-19" width="2.6" height="6" fill="#9ca3af" />
      {/* rear wheel (wider, speedway tyre) with red mudguard */}
      <rect x="-4.8" y="13" width="9.6" height="18" rx="4.8" fill="#111827" />
      <rect x="-5.4" y="11" width="10.8" height="7" rx="3" fill={COLORS.red} />
      {/* frame, engine, fuel tank */}
      <rect x="-1.6" y="-14" width="3.2" height="28" rx="1" fill="#9ca3af" />
      <rect x="-4.2" y="-3" width="8.4" height="9" rx="1.5" fill="#6b7280" />
      <rect x="-3.4" y="-12" width="6.8" height="7" rx="2.8" fill={COLORS.red} />
      {/* handlebar */}
      <line x1="-11.5" y1="-15" x2="11.5" y2="-15" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />

      {/* rider: left leg out in the bends (steel shoe), right leg along the bike */}
      <line x1="-3.5" y1="5" x2={r2(-6 - 5 * slide)} y2={r2(4 - 8 * slide)} stroke={COLORS.fence} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={r2(-6.5 - 5 * slide)} cy={r2(2.5 - 8 * slide)} rx="2" ry="3.4" fill="#d1d5db" />
      <line x1="3.5" y1="5" x2="5" y2="11" stroke={COLORS.fence} strokeWidth="3" strokeLinecap="round" />
      {/* arms to the grips */}
      <line x1="-4.5" y1="-2" x2="-10.5" y2="-15" stroke={COLORS.fence} strokeWidth="2.8" strokeLinecap="round" />
      <line x1="4.5" y1="-2" x2="10.5" y2="-15" stroke={COLORS.fence} strokeWidth="2.8" strokeLinecap="round" />
      {/* back */}
      <ellipse cx="0" cy="3" rx="6" ry="7" fill={COLORS.fence} />
      {/* helmet with stripe */}
      <circle cx="0" cy="-4" r="4.8" fill={COLORS.red} />
      <rect x="-1" y="-8.8" width="2" height="9.6" fill="#ffffff" />
    </g>
  );
}

interface Step {
  title: string;
  desc: string;
}

interface ProcessRaceProps {
  steps: Step[];
  header: React.ReactNode;
  cta: React.ReactNode;
  finishLabel: string;
  replayLabel: string;
  trackLabel: string;
}

export default function ProcessRace({ steps, header, cta, finishLabel, replayLabel, trackLabel }: ProcessRaceProps) {
  const uid = useId().replace(/:/g, '');
  const segment = LAP / steps.length;
  const [progress, setProgress] = useState(0); // 0..1 of the lap (1 = on the finish line)
  const [running, setRunning] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const frame = useRef<number | null>(null);
  const progressRef = useRef(0);
  const started = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const n = steps.length;
  const finished = progress >= 1;
  const reached = Math.min(n, Math.floor(progress * n + 1e-6)); // completed segments
  // segment the bike is in (a bike parked inside segment i belongs to step i)
  const current = Math.max(0, Math.min(n - 1, Math.ceil(progress * n - 1e-6) - 1));

  const show = useCallback((value: number) => {
    progressRef.current = value;
    setProgress(value);
  }, []);

  /**
   * Ride forward from the current position to `target` (0..1 of a lap).
   * If the target lies behind the bike, it rides on through the finish line into a new lap.
   */
  const rideTo = useCallback(
    (target: number, { fromStart = false } = {}) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        show(target);
        setRunning(false);
        return;
      }
      let from = fromStart ? 0 : progressRef.current;
      if (from >= 1) from = 0; // parked on the line = start of the next lap
      const to = target > from ? target : target + 1; // never ride backwards
      if (Math.abs(to - from) < 1e-6) return;
      const duration = Math.max(900, (to - from) * LAP_DURATION_MS);
      const startTime = performance.now();
      setRunning(true);
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const value = from + (to - from) * easeInOut(t);
        // after crossing the line the red trail starts again from zero
        show(value > 1 + 1e-9 ? value - 1 : value);
        if (t < 1) frame.current = requestAnimationFrame(tick);
        else setRunning(false);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [show]
  );

  /** Park the bike in segment i (just before its end); the last step ends on the finish line. */
  const goToStep = useCallback(
    (i: number) => rideTo(i === n - 1 ? 1 : (i + 0.85) / n),
    [n, rideTo]
  );

  const run = useCallback(() => rideTo(1, { fromStart: true }), [rideTo]);

  // Start the lap once the track itself is visible
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [run]);

  const distance = progress * LAP;
  const bike = pointAt(distance);
  const heading = headingAt(distance);
  const slide = r2(bendWeight(distance));
  const labelPoint = (i: number) => pointAt(segment * i + segment / 2);

  return (
    <div className="container grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      {/* Track */}
      <div className="lg:col-span-5 order-2 lg:order-1">
        <div ref={rootRef} className="relative mx-auto max-w-[300px] lg:max-w-none">
          <svg viewBox="0 0 400 520" className="w-full h-auto" role="img" aria-label={trackLabel}>
            <TrackArt uid={uid} />

            {/* segment boundaries */}
            {steps.map((_, i) => {
              if (i === 0) return null;
              const p = pointAt(segment * i);
              const q = pointAt(segment * i + 1);
              const angle = r2((Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI);
              return (
                <line
                  key={`b${i}`}
                  x1={-TRACK_WIDTH / 2}
                  x2={TRACK_WIDTH / 2}
                  y1={0}
                  y2={0}
                  stroke="#ffffff"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  transform={`translate(${p.x} ${p.y}) rotate(${angle + 90})`}
                />
              );
            })}

            {/* hovered segment */}
            {hovered !== null && (
              <path
                d={LAP_PATH}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.22"
                strokeWidth={TRACK_WIDTH - 6}
                pathLength={LAP}
                strokeDasharray={`${segment} ${LAP}`}
                strokeDashoffset={-segment * hovered}
              />
            )}

            {/* ridden distance: fresh red line behind the bike */}
            <path
              d={LAP_PATH}
              fill="none"
              stroke={COLORS.red}
              strokeWidth="4"
              strokeLinecap="round"
              strokeOpacity="0.9"
              pathLength={LAP}
              strokeDasharray={`${r2(distance)} ${LAP}`}
            />

            {/* segment numbers, placed in the infield next to their segment */}
            {steps.map((_, i) => {
              const p = labelPoint(i);
              const lit = reached > i || (i === current && progress > 0);
              // move the badge from the centre line towards the infield
              const dx = r2(((CX - p.x) / Math.hypot(CX - p.x, (TOP + BOTTOM) / 2 - p.y || 1)) * 52);
              const dy = r2((((TOP + BOTTOM) / 2 - p.y) / Math.hypot(CX - p.x, (TOP + BOTTOM) / 2 - p.y || 1)) * 52);
              return (
                <g
                  key={`n${i}`}
                  onClick={() => goToStep(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-transform duration-300"
                  style={{ transform: `translate(${r2(p.x + dx)}px, ${r2(p.y + dy)}px) scale(${hovered === i ? 1.12 : 1})` }}
                >
                  <circle r="17" fill={lit ? COLORS.red : '#ffffff'} stroke={lit ? COLORS.red : '#ffffff'} strokeWidth="2" className="transition-colors duration-300" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontFamily="var(--font-mono)" fill={lit ? '#ffffff' : '#001f3f'} className="transition-colors duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              );
            })}

            {/* finish flag */}
            <g
              className="transition-all duration-500"
              style={{ opacity: finished ? 1 : 0, transform: `translate(${CX + OUTER + 12}px, ${START_Y - 2}px) scale(${finished ? 1 : 0.4})` }}
            >
              <line x1="0" y1="0" x2="0" y2="-62" stroke={COLORS.fence} strokeWidth="3" strokeLinecap="round" />
              <g className={finished ? 'race-flag-wave' : ''}>
                {Array.from({ length: 3 }).map((_, row) =>
                  Array.from({ length: 4 }).map((__, col) => (
                    <rect key={`f${row}-${col}`} x={1.5 + col * 9} y={-62 + row * 9} width="9" height="9" fill={(row + col) % 2 === 0 ? '#111827' : '#ffffff'} stroke="#111827" strokeWidth="0.5" />
                  ))
                )}
              </g>
              <text x="0" y="18" fontSize="14" fontFamily="var(--font-display)" fontWeight="700" fill={COLORS.fence} letterSpacing="1">
                {finishLabel.toUpperCase()}
              </text>
            </g>

            {/* finish pulse */}
            {finished && <circle cx={CX + R} cy={START_Y} r="12" fill="none" stroke={COLORS.red} strokeWidth="3" className="race-finish-pulse" />}

            {/* the bike */}
            <SpeedwayBike x={bike.x} y={bike.y} heading={heading} slide={slide} moving={running} />
          </svg>

          <button
            type="button"
            onClick={run}
            className="absolute left-0 top-0 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/50 hover:text-primary transition-colors"
          >
            <RotateCcw size={13} />
            {replayLabel}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="lg:col-span-7 flex flex-col order-1 lg:order-2">
        {header}
        <ol className="border-t border-secondary/15 mt-10">
          {steps.map((step, i) => {
            const active = progress > 0 && i === current && !finished;
            const done = reached > i || (finished && i === steps.length - 1);
            return (
              <li
                key={step.title}
                role="button"
                tabIndex={0}
                aria-pressed={progress > 0 && i === current}
                onClick={() => goToStep(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToStep(i);
                  }
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className={`relative grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-secondary/15 cursor-pointer outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary ${
                  active || hovered === i ? 'bg-white' : ''
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-0.5 bg-primary origin-top transition-transform duration-500 ${
                    active || done ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
                <span className={`font-mono text-sm pt-1 pl-3 transition-colors duration-300 ${active || done ? 'text-primary' : 'text-secondary/40'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display font-semibold uppercase text-2xl tracking-tight mb-1 flex items-center gap-3 min-h-[2rem]">
                    {step.title}
                    {finished && i === steps.length - 1 && (
                      <span className="race-pop inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.15em] text-white bg-secondary px-2 py-1 rounded-sm">
                        <span aria-hidden>🏁</span> {finishLabel}
                      </span>
                    )}
                  </h3>
                  <p className="text-secondary/70 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-10">{cta}</div>
      </div>
    </div>
  );
}
