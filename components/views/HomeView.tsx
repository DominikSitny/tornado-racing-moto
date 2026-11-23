'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import Image from 'next/image';
import PhotoSlot from '@/components/PhotoSlot';
import ProcessRace from '@/components/ProcessRace';
import { siteImages } from '@/lib/site-images';
import { Category } from '@/lib/types';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

function SectionLabel({ index, children, light }: { index: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.2em] ${light ? 'text-white/60' : 'text-secondary/50'}`}>
      <span className="text-primary">{index}</span> / {children}
    </p>
  );
}

export default function HomeView({ categories }: { categories: Category[] }) {
  const locale = useLocale();
  const t = useTranslations('home');
  const tCatalog = useTranslations('catalog');


  const facts = [
    { label: t('factShipping'), value: t('factShippingValue') },
    { label: t('factLanguages'), value: t('factLanguagesValue') },
    { label: t('factPrices'), value: t('factPricesValue') },
  ];

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc') },
    { title: t('step2Title'), desc: t('step2Desc') },
    { title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="bg-secondary text-white">
          {siteImages.hero ? (
            <>
              {/* Banner: full-width photo, text below so no rider is covered */}
              <div className="relative w-full h-[clamp(240px,50vw,720px)] overflow-hidden">
                <Image
                  src={siteImages.hero}
                  alt={t('heroAlt')}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: '50% 68%' }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
              </div>
              <div className="container pt-8 pb-14 md:pt-10 md:pb-16 grid lg:grid-cols-12 gap-8 lg:items-end">
                <div className="lg:col-span-8">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
                    <span className="inline-block w-6 h-px bg-primary align-middle mr-3" />
                    {t('eyebrow')}
                  </p>
                  <h1 className="font-display font-bold uppercase text-[2.75rem] leading-[0.95] sm:text-6xl lg:text-7xl tracking-tight mb-6 text-balance">
                    {t('title')}
                  </h1>
                  <p className="text-lg md:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
                    {t('subtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
                    <Button
                      as={Link}
                      href={`/${locale}/categories`}
                      color="primary"
                      size="lg"
                      radius="sm"
                      endContent={<ArrowRight size={18} />}
                      className="font-semibold px-7"
                    >
                      {t('toCatalog')}
                    </Button>
                    <Button
                      as={Link}
                      href={`/${locale}/contact`}
                      variant="bordered"
                      size="lg"
                      radius="sm"
                      className="font-semibold px-7 border-1 border-white/40 text-white hover:bg-white hover:text-secondary"
                    >
                      {t('contactUs')}
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:flex lg:col-span-4 lg:justify-end gap-3 pb-1">
                  <Button as={Link} href={`/${locale}/categories`} color="primary" size="lg" radius="sm" endContent={<ArrowRight size={18} />} className="font-semibold px-7">
                    {t('toCatalog')}
                  </Button>
                  <Button
                    as={Link}
                    href={`/${locale}/contact`}
                    variant="bordered"
                    size="lg"
                    radius="sm"
                    className="font-semibold px-7 border-1 border-white/40 text-white hover:bg-white hover:text-secondary"
                  >
                    {t('contactUs')}
                  </Button>
                </div>
              </div>
            </>
          ) : (
          <div className="container grid lg:grid-cols-12 gap-10 lg:gap-12 py-14 md:py-20 lg:py-24 items-center">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
                <span className="inline-block w-6 h-px bg-primary align-middle mr-3" />
                {t('eyebrow')}
              </p>
              <h1 className="font-display font-bold uppercase text-[2.75rem] leading-[0.95] sm:text-6xl lg:text-7xl tracking-tight mb-6 text-balance">
                {t('title')}
              </h1>
              <p className="text-lg md:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
                {t('subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  as={Link}
                  href={`/${locale}/categories`}
                  color="primary"
                  size="lg"
                  radius="sm"
                  endContent={<ArrowRight size={18} />}
                  className="font-semibold px-7"
                >
                  {t('toCatalog')}
                </Button>
                <Button
                  as={Link}
                  href={`/${locale}/contact`}
                  variant="bordered"
                  size="lg"
                  radius="sm"
                  className="font-semibold px-7 border-1 border-white/40 text-white hover:bg-white hover:text-secondary"
                >
                  {t('contactUs')}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <PhotoSlot
                src={siteImages.hero}
                alt={t('heroAlt')}
                hint="hero.jpg"
                priority
                className="aspect-[4/3] w-full border border-white/10"
              />
            </div>
          </div>
          )}

          {/* Facts */}
          <div className="border-t border-white/10">
            <dl className="container grid sm:grid-cols-3">
              {facts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`py-6 sm:px-6 first:sm:pl-0 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-white/10' : ''}`}
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 mb-1">{fact.label}</dt>
                  <dd className="font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Catalog */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <SectionLabel index="01">{t('catalogLabel')}</SectionLabel>
                <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3">{t('ourCatalog')}</h2>
                <p className="text-secondary/70 mt-2">{t('catalogDesc')}</p>
              </div>
              {categories.length > 0 && (
                <Link
                  href={`/${locale}/categories`}
                  className="group inline-flex items-center gap-2 font-semibold text-secondary hover:text-primary transition-colors"
                >
                  {t('viewAll')}
                  <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>

            {categories.length === 0 ? (
              <div className="border border-dashed border-secondary/20 px-6 py-10 text-secondary/70">
                {tCatalog('noCategories')}
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

        {/* Process */}
        <section id="ablauf" className="bg-gray-50 border-t border-secondary/10 py-16 md:py-24 scroll-mt-20">
          <ProcessRace
            steps={steps}
            finishLabel={t('finish')}
            replayLabel={t('replay')}
            trackLabel={t('trackAria')}
            header={
              <>
                <SectionLabel index="02">{t('processLabel')}</SectionLabel>
                <h2 className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight mt-3">{t('processTitle')}</h2>
              </>
            }
            cta={
              <Button
                as={Link}
                href={`/${locale}/contact`}
                color="primary"
                size="lg"
                radius="sm"
                endContent={<ArrowRight size={18} />}
                className="font-semibold px-7"
              >
                {t('processCta')}
              </Button>
            }
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
