'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Button, Card, CardBody } from '@nextui-org/react';
import { Award, Users, Wrench, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations('about');
  const tNav = useTranslations('navigation');

  const values = [
    {
      icon: Award,
      title: t('quality'),
      description: t('qualityText'),
      gradient: 'from-primary to-red-500',
    },
    {
      icon: Users,
      title: t('expertise'),
      description: t('expertiseText'),
      gradient: 'from-secondary to-blue-700',
    },
    {
      icon: Wrench,
      title: t('service'),
      description: t('serviceText'),
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Heart,
      title: t('trust'),
      description: t('trustText'),
      gradient: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb
          items={[
            { label: tNav('about') },
          ]}
        />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary via-blue-900 to-secondary text-white py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-xl">
                <CardBody className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-secondary mb-6">{t('story')}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t('storyText')}
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-secondary mb-6">{t('mission')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('missionText')}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-secondary mb-12 text-center">{t('values')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardBody className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                      <value.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-secondary mb-6">{t('team')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('teamText')}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-secondary via-blue-900 to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">{t('contactCta')}</h2>
            <Button
              as={Link}
              href={`/${locale}/contact`}
              size="lg"
              radius="full"
              variant="shadow"
              endContent={<ArrowRight size={20} />}
              className="font-bold text-lg px-10 h-14 bg-white text-secondary hover:bg-gray-100"
            >
              {t('contactButton')}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
