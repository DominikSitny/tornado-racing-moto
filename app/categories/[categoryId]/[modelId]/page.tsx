'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PartCard from '@/components/PartCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Chip, Spinner } from '@nextui-org/react';
import { Category, Model } from '@/lib/types';

export default function ModelPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const modelId = params.modelId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/catalog');
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
  }, [categoryId, modelId]);

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

  if (!category || !model) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: 'Katalog', href: '/categories' },
            { label: category.name, href: `/categories/${category.id}` },
            { label: `${model.brand} ${model.designation}` },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Chip
                color="primary"
                variant="shadow"
                size="lg"
                className="mb-4 bg-gradient-to-r from-primary to-red-500"
              >
                {model.brand}
              </Chip>
              <h1 className="text-5xl font-bold text-secondary mb-4">
                {model.designation}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                {model.description}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-secondary mb-6">Verfügbare Teile</h2>

            {model.parts.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                Keine Teile für dieses Modell verfügbar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {model.parts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    categoryId={categoryId}
                    modelId={model.id}
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
