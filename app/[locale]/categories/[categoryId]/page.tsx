'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ModelCard from '@/components/ModelCard';
import PageHeader from '@/components/PageHeader';
import { Category } from '@/lib/types';
import { Spinner } from '@nextui-org/react';
import { useLocale, useTranslations } from 'next-intl';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const locale = useLocale();
  const t = useTranslations('catalog');

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/catalog?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const found = data.categories?.find((c: Category) => c.id === categoryId);
          setCategory(found || null);
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, locale]);

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

  if (!category) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          breadcrumb={[
            { label: t('title'), href: `/${locale}/categories` },
            { label: category.name },
          ]}
          eyebrow={`${category.models.length} ${category.models.length === 1 ? t('model') : t('models')}`}
          title={category.name}
          lead={category.description || undefined}
        />

        <section className="py-12 md:py-16 pb-20">
          <div className="container">
            {category.models.length === 0 ? (
              <div className="border border-dashed border-secondary/20 px-6 py-10 text-secondary/70">
                {t('noModelsAvailable')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-secondary/15">
                {category.models.map((model) => (
                  <ModelCard key={model.id} model={model} categoryId={category.id} />
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
