'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import PhotoSlot from '@/components/PhotoSlot';
import { siteImages } from '@/lib/site-images';
import { Button } from '@nextui-org/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

function SectionIndex({ index }: { index: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] text-primary flex items-center gap-3">
      {index}
      <span className="inline-block w-6 h-px bg-secondary/20" />
    </p>
  );
}

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations('about');
  const tHome = useTranslations('home');
  const tNav = useTranslations('navigation');

  const principles = [
    { title: t('quality'), text: t('qualityText') },
    { title: t('expertise'), text: t('expertiseText') },
    { title: t('service'), text: t('serviceText') },
  ];

  const facts = [
    { label: tHome('factShipping'), value: tHome('factShippingValue') },
    { label: tHome('factLanguages'), value: tHome('factLanguagesValue') },
    { label: tHome('factPrices'), value: tHome('factPricesValue') },
  ];

  return (
    <>
      <Navigation />
      <main>
        <PageHeader
          breadcrumb={[{ label: tNav('about') }]}
          eyebrow={t('title')}
          title="Tornado Racing Moto"
          lead={t('lead')}
        >
          <dl className="grid sm:grid-cols-3 mt-10 border-t border-secondary/10">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`pt-5 pb-1 sm:pr-6 ${i > 0 ? 'sm:pl-6 sm:border-l border-secondary/10 max-sm:border-t max-sm:mt-5' : ''}`}
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/50 mb-1">{fact.label}</dt>
                <dd className="font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </PageHeader>

        {/* Story & mission */}
        <section className="py-16 md:py-24">
          <div className="container grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:order-2">
              <PhotoSlot src={siteImages.workshop} alt={t('workshopAlt')} hint="workshop.jpg" figure={1} className="aspect-[4/5] w-full" />
            </div>
            <div className="lg:col-span-7 lg:order-1 space-y-12">
              <div>
                <SectionIndex index="01" />
                <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3 mb-5">{t('story')}</h2>
                <p className="text-lg text-secondary/75 leading-relaxed max-w-2xl">{t('storyText')}</p>
              </div>
              <div>
                <SectionIndex index="02" />
                <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3 mb-5">{t('mission')}</h2>
                <p className="text-lg text-secondary/75 leading-relaxed max-w-2xl">{t('missionText')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-gray-50 border-y border-secondary/10 py-16 md:py-24">
          <div className="container">
            <SectionIndex index="03" />
            <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3 mb-10">{t('principles')}</h2>
            <ol className="grid md:grid-cols-3 border-t border-secondary/15">
              {principles.map((item, i) => (
                <li
                  key={item.title}
                  className={`py-8 md:pr-8 ${i > 0 ? 'border-t md:border-t-0 md:border-l md:pl-8 border-secondary/15' : ''}`}
                >
                  <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-semibold uppercase text-2xl tracking-tight mt-3 mb-2">{item.title}</h3>
                  <p className="text-secondary/70 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <PhotoSlot src={siteImages.team} alt={t('teamAlt')} hint="team.jpg" figure={2} className="aspect-[16/10] w-full" />
            </div>
            <div className="lg:col-span-5">
              <SectionIndex index="04" />
              <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3 mb-5">{t('team')}</h2>
              <p className="text-lg text-secondary/75 leading-relaxed">{t('teamText')}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary text-white">
          <div className="container py-14 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight">{t('ctaTitle')}</h2>
              <p className="text-white/70 mt-3 text-lg max-w-xl">{t('ctaText')}</p>
            </div>
            <Button
              as={Link}
              href={`/${locale}/contact`}
              color="primary"
              size="lg"
              radius="sm"
              endContent={<ArrowRight size={18} />}
              className="font-semibold px-7 shrink-0 self-start md:self-auto"
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
