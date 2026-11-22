'use client';

import Link from 'next/link';
import { Model } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface ModelCardProps {
  model: Model;
  categoryId: string;
}

export default function ModelCard({ model, categoryId }: ModelCardProps) {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const partCount = model.parts.length;

  return (
    <Link
      href={`/${locale}/categories/${categoryId}/${model.id}`}
      className="group relative flex flex-col bg-white border-r border-b border-secondary/15 p-6 md:p-8 min-h-[240px] transition-colors hover:bg-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.15em] mb-8">
        <span className="text-primary group-hover:text-white">{model.brand}</span>
        <span className="text-secondary/50 group-hover:text-white/60">
          {partCount} {partCount === 1 ? t('part') : t('parts')}
        </span>
      </div>

      <h2 className="font-display font-bold uppercase text-3xl tracking-tight leading-none mb-3">{model.designation}</h2>
      {model.description && (
        <p className="text-secondary/70 group-hover:text-white/75 text-sm leading-relaxed line-clamp-3">{model.description}</p>
      )}

      <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-white">
        {t('details')}
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span className="absolute left-0 top-0 h-full w-0.5 bg-primary scale-y-0 origin-top transition-transform group-hover:scale-y-100" />
    </Link>
  );
}
