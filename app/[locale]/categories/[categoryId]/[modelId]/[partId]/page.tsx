'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Button, Card, Chip, Divider, Spinner } from '@nextui-org/react';
import { Mail, ArrowLeft, Tag, Bike } from 'lucide-react';
import { Category, Model, Part } from '@/lib/types';
import { useLocale, useTranslations } from 'next-intl';

export default function PartPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const modelId = params.modelId as string;
  const partId = params.partId as string;
  const locale = useLocale();
  const t = useTranslations('catalog');
  const tMsg = useTranslations('contactMessage');

  const [category, setCategory] = useState<Category | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [part, setPart] = useState<Part | null>(null);
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
          const foundPart = foundModel?.parts?.find((p: Part) => p.id === partId);
          setPart(foundPart || null);
        }
      } catch (error) {
        console.error('Error loading part:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId, modelId, partId]);

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

  if (!category || !model || !part) {
    notFound();
  }

  const contactMessage = `${tMsg('greeting')}\n\n${tMsg('interested')}\n\n${tMsg('partLabel')}: ${part.name}\n${tMsg('modelLabel')}: ${model.brand} ${model.designation}\n${tMsg('categoryLabel')}: ${category.name}\n\n${tMsg('pleaseContact')}\n\n${tMsg('regards')}`;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: t('title'), href: `/${locale}/categories` },
            { label: category.name, href: `/${locale}/categories/${category.id}` },
            {
              label: `${model.brand} ${model.designation}`,
              href: `/${locale}/categories/${category.id}/${model.id}`,
            },
            { label: part.name },
          ]}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image */}
              <Card className="border-none shadow-xl overflow-hidden">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>

              {/* Details */}
              <div className="flex flex-col">
                <Chip
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="mb-4 self-start"
                >
                  {category.name}
                </Chip>

                <h1 className="text-4xl font-bold text-secondary mb-4">
                  {part.name}
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {part.description}
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  <Button
                    as={Link}
                    href={`/${locale}/contact?message=${encodeURIComponent(contactMessage)}`}
                    color="primary"
                    variant="shadow"
                    size="lg"
                    radius="lg"
                    startContent={<Mail size={20} />}
                    className="font-bold text-lg h-14 bg-gradient-to-r from-primary to-red-500"
                  >
                    {t('interestedContact')}
                  </Button>
                  <Button
                    as={Link}
                    href={`/${locale}/categories/${category.id}/${model.id}`}
                    variant="bordered"
                    size="lg"
                    radius="lg"
                    startContent={<ArrowLeft size={20} />}
                    className="font-medium h-14"
                  >
                    {t('backToParts')}
                  </Button>
                </div>

                <Divider className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Tag size={18} className="text-gray-400" />
                    <span className="text-gray-600">{t('category')}:</span>
                    <Link
                      href={`/${locale}/categories/${category.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {category.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bike size={18} className="text-gray-400" />
                    <span className="text-gray-600">{t('model')}:</span>
                    <Link
                      href={`/${locale}/categories/${category.id}/${model.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {model.brand} {model.designation}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
