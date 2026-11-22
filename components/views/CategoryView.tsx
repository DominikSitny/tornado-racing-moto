'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ModelCard from '@/components/ModelCard';
import PageHeader from '@/components/PageHeader';
import { Category } from '@/lib/types';
import { useLocale, useTranslations } from 'next-intl';

export default function CategoryView({ category }: { category: Category }) {
  const locale = useLocale();
  const t = useTranslations('catalog');




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
