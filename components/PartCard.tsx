'use client';

import Link from 'next/link';
import { Part } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import PartImage from '@/components/PartImage';

interface PartCardProps {
  part: Part;
  categoryId: string;
  modelId: string;
}

export default function PartCard({ part, categoryId, modelId }: PartCardProps) {
  const locale = useLocale();
  const t = useTranslations('catalog');

  return (
    <Link
      href={`/${locale}/categories/${categoryId}/${modelId}/${part.id}`}
      className="group flex flex-col bg-white border-r border-b border-secondary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <PartImage
        src={part.image}
        alt={part.name}
        className="aspect-[4/3] w-full border-b border-secondary/10 [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03]"
      />
      <div className="flex flex-col flex-1 p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/50 mb-3">
          {t('price')}: {part.price || t('onRequest')}
        </p>
        <h3 className="font-display font-bold uppercase text-2xl tracking-tight leading-none mb-2 group-hover:text-primary transition-colors">
          {part.name}
        </h3>
        {part.description && <p className="text-sm text-secondary/70 leading-relaxed line-clamp-2 whitespace-pre-line">{part.description}</p>}
        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {t('showDetails')}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
