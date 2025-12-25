'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Chip, Spinner } from '@nextui-org/react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { Category } from '@/lib/types';
import { ArrowRight, Zap, Shield, Wrench, Star, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('home');
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
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary via-blue-900 to-secondary text-white py-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <Chip
                startContent={<Sparkles size={14} />}
                variant="flat"
                color="primary"
                className="mb-8 bg-white/10 text-white border border-white/20"
                size="lg"
              >
                {t('badge')}
              </Chip>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {t('title')}
                <span className="block text-primary mt-2">{t('brandName')}</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  href={`/${locale}/categories`}
                  color="primary"
                  variant="shadow"
                  size="lg"
                  radius="full"
                  endContent={<ArrowRight size={20} />}
                  className="font-bold text-lg px-8 h-14 bg-gradient-to-r from-primary to-red-500"
                >
                  {t('toCatalog')}
                </Button>
                <Button
                  as={Link}
                  href={`/${locale}/contact`}
                  variant="bordered"
                  size="lg"
                  radius="full"
                  className="font-bold text-lg px-8 h-14 border-white/30 text-white hover:bg-white/10"
                >
                  {t('contactUs')}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{t('fastDelivery')}</h3>
                  <p className="text-gray-600">{t('fastDeliveryDesc')}</p>
                </CardBody>
              </Card>

              <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-blue-700 flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
                    <Shield size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{t('qualityGuarantee')}</h3>
                  <p className="text-gray-600">{t('qualityGuaranteeDesc')}</p>
                </CardBody>
              </Card>

              <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
                    <Wrench size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{t('expertSupport')}</h3>
                  <p className="text-gray-600">{t('expertSupportDesc')}</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Chip
                startContent={<Star size={14} />}
                variant="flat"
                color="primary"
                className="mb-4"
              >
                {t('productCatalog')}
              </Chip>
              <h2 className="text-4xl font-bold text-secondary mb-4">{t('ourCatalog')}</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {t('catalogDesc')}
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-secondary via-blue-900 to-secondary text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-400/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('questionsTitle')}</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t('questionsDesc')}
            </p>
            <Button
              as={Link}
              href={`/${locale}/contact`}
              size="lg"
              radius="full"
              variant="shadow"
              endContent={<ArrowRight size={20} />}
              className="font-bold text-lg px-10 h-14 bg-white text-secondary hover:bg-gray-100"
            >
              {t('contactUs')}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
