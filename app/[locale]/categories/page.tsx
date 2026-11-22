'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Category } from '@/lib/types';
import { Button, Spinner } from '@nextui-org/react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const tNav = useTranslations('navigation');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/catalog?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [locale]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <Breadcrumb
          items={[
            { label: t('title') },
          ]}
        />

        <section className="pt-6 pb-20">
          <div className="container">
            <h1 className="font-display font-bold uppercase text-5xl md:text-6xl tracking-tight mb-10">{t('title')}</h1>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="border border-dashed border-secondary/20 px-6 py-10">
                <p className="text-secondary/70 mb-6 max-w-xl">{t('noCategories')}</p>
                <Button as={Link} href={`/${locale}/contact`} color="primary" radius="sm" className="font-semibold">
                  {tNav('contact')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-secondary/15">
                {categories.map((category, i) => (
                  <CategoryCard key={category.id} category={category} index={i + 1} />
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
