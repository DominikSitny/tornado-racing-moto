'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ModelCard from '@/components/ModelCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Category } from '@/lib/types';
import { Spinner } from '@nextui-org/react';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/catalog');
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
  }, [categoryId]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spinner size="lg" color="primary" />
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
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: 'Katalog', href: '/categories' },
            { label: category.name },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-secondary mb-4">{category.name}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl">
              {category.description}
            </p>

            {category.models.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                Keine Modelle in dieser Kategorie verfügbar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    categoryId={category.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white text-secondary py-8 text-center border-t">
        <p className="text-secondary/60">&copy; 2024 Tornado Racing Moto. Alle Rechte vorbehalten.</p>
      </footer>
    </>
  );
}
