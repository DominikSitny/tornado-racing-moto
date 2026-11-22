'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PartImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Part photo with a neutral fallback when the file is missing or fails to load. */
export default function PartImage({ src, alt, className = '', sizes, priority }: PartImageProps) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-secondary/30">
          <ImageOff size={28} strokeWidth={1.5} />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em]">{alt}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'}
          priority={priority}
          className="object-contain p-4 md:p-6"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
