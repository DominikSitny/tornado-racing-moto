'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Category } from '@/lib/types';
import { Spinner } from '@nextui-org/react';
import { useLocale, useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const locale = useLocale();
  const t = useTranslations('catalog');
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
  }, []);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: t('title') },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-secondary mb-8">{t('title')}</h1>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
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
