'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface CategoryCardProps {
  category: Category;
  /** Position in the list, shown as "01", "02", … */
  index?: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const modelCount = category.models.length;

  return (
    <Link
      href={`/${locale}/categories/${category.id}`}
      className="group relative flex flex-col bg-white border-r border-b border-secondary/15 p-6 md:p-8 min-h-[240px] transition-colors hover:bg-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.15em] text-secondary/50 group-hover:text-white/60 mb-8">
        <span>{index !== undefined ? String(index).padStart(2, '0') : ''}</span>
        <span>
          {modelCount} {modelCount === 1 ? t('model') : t('models')}
        </span>
      </div>

      <h2 className="font-display font-bold uppercase text-3xl tracking-tight leading-none mb-3">
        {category.name}
      </h2>
      {category.description && (
        <p className="text-secondary/70 group-hover:text-white/75 text-sm leading-relaxed line-clamp-3">
          {category.description}
        </p>
      )}

      <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-white">
        {t('view')}
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span className="absolute left-0 top-0 h-full w-0.5 bg-primary scale-y-0 origin-top transition-transform group-hover:scale-y-100" />
    </Link>
  );
}
