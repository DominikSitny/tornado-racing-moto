'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PartCard from '@/components/PartCard';
import PageHeader from '@/components/PageHeader';
import { Spinner } from '@nextui-org/react';
import { Category, Model } from '@/lib/types';
import { useLocale, useTranslations } from 'next-intl';

export default function ModelPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const modelId = params.modelId as string;
  const locale = useLocale();
  const t = useTranslations('catalog');

  const [category, setCategory] = useState<Category | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/catalog?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const foundCat = data.categories?.find((c: Category) => c.id === categoryId);
          setCategory(foundCat || null);
          const foundModel = foundCat?.models?.find((m: Model) => m.id === modelId);
          setModel(foundModel || null);
        }
      } catch (error) {
        console.error('Error loading model:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, modelId, locale]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-[70vh] flex items-center justify-center">
          <Spinner color="primary" />
        </main>
      </>
    );
  }

  if (!category || !model) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          breadcrumb={[
            { label: t('title'), href: `/${locale}/categories` },
            { label: category.name, href: `/${locale}/categories/${category.id}` },
            { label: `${model.brand} ${model.designation}` },
          ]}
          eyebrow={category.name}
          title={`${model.brand} ${model.designation}`.trim()}
          lead={model.description || undefined}
        />

        <section className="py-12 md:py-16 pb-20">
          <div className="container">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display font-bold uppercase text-3xl tracking-tight">{t('availableParts')}</h2>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-secondary/50">
                {model.parts.length} {model.parts.length === 1 ? t('part') : t('parts')}
              </span>
            </div>

            {model.parts.length === 0 ? (
              <div className="border border-dashed border-secondary/20 px-6 py-10 text-secondary/70">
                {t('noPartsAvailable')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-secondary/15">
                {model.parts.map((part) => (
                  <PartCard key={part.id} part={part} categoryId={categoryId} modelId={model.id} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
