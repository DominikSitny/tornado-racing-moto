'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Category } from '@/lib/types';
import { Spinner } from '@nextui-org/react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/catalog');
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
            { label: 'Katalog' },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-secondary mb-8">Katalog</h1>

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

      <footer className="bg-white text-secondary py-8 text-center border-t">
        <p className="text-secondary/60">&copy; 2024 Tornado Racing Moto. Alle Rechte vorbehalten.</p>
      </footer>
    </>
  );
}
