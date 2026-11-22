import Image from 'next/image';

interface PhotoSlotProps {
  src: string | null;
  alt: string;
  /** Name of the expected file, shown only during development. */
  hint: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Figure number shown in the corner of the placeholder drawing. */
  figure?: number;
}

/**
 * Shows a real photo once one is configured in `lib/site-images.ts`.
 * Until then it renders a technical line drawing of a camshaft so the
 * layout already looks intentional.
 */
export default function PhotoSlot({ src, alt, hint, className = '', priority, sizes, figure = 1 }: PhotoSlotProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-secondary-700 ${className}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#06294d] ${className}`}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <CamshaftDrawing className="absolute inset-x-[8%] top-1/2 -translate-y-1/2 w-[84%] text-white/45" />
      <span className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest text-white/40">
        Fig. {String(figure).padStart(2, '0')}
      </span>
      {process.env.NODE_ENV !== 'production' && (
        <span className="absolute bottom-3 right-4 font-mono text-[11px] text-white/40">
          Foto folgt · {hint}
        </span>
      )}
    </div>
  );
}

function CamshaftDrawing({ className }: { className?: string }) {
  // Alternating lobes between bearing journals, drawn like a technical sketch.
  const lobes = [70, 120, 210, 260, 350, 400];
  const journals = [30, 165, 305, 445];

  return (
    <svg viewBox="0 0 480 160" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      {/* centre line */}
      <line x1="0" y1="80" x2="480" y2="80" strokeDasharray="10 4 2 4" strokeWidth="0.75" />
      {/* shaft */}
      <rect x="8" y="72" width="464" height="16" />
      {/* bearing journals */}
      {journals.map((x) => (
        <rect key={x} x={x - 9} y="56" width="18" height="48" />
      ))}
      {/* lobes: base circle + nose, alternating direction */}
      {lobes.map((x, i) => {
        const up = i % 2 === 0;
        const nose = up ? 22 : 138;
        const shoulder = nose + (up ? 4 : -4);
        return (
          <path
            key={x}
            d={`M ${x - 14} 80 A 14 22 0 0 ${up ? 0 : 1} ${x + 14} 80 L ${x + 6} ${shoulder} Q ${x} ${nose} ${x - 6} ${shoulder} Z`}
          />
        );
      })}
      {/* drive end */}
      <rect x="0" y="66" width="8" height="28" />
      {/* dimension line */}
      <g strokeWidth="0.75">
        <line x1="8" y1="140" x2="472" y2="140" />
        <line x1="8" y1="134" x2="8" y2="146" />
        <line x1="472" y1="134" x2="472" y2="146" />
      </g>
    </svg>
  );
}
