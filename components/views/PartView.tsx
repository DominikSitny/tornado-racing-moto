'use client';

import PartImage from '@/components/PartImage';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@nextui-org/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Category, Model, Part } from '@/lib/types';
import { useLocale, useTranslations } from 'next-intl';

export default function PartView({ category, model, part }: { category: Category; model: Model; part: Part }) {
  const locale = useLocale();
  const t = useTranslations('catalog');
  const tMsg = useTranslations('contactMessage');




  const contactMessage = `${tMsg('greeting')}\n\n${tMsg('interested')}\n\n${tMsg('partLabel')}: ${part.name}\n${tMsg('modelLabel')}: ${model.brand} ${model.designation}\n${tMsg('categoryLabel')}: ${category.name}\n\n${tMsg('pleaseContact')}\n\n${tMsg('regards')}`;

  const specs = [
    { label: t('category'), value: category.name, href: `/${locale}/categories/${category.id}` },
    { label: t('model'), value: `${model.brand} ${model.designation}`, href: `/${locale}/categories/${category.id}/${model.id}` },
    { label: t('price'), value: part.price || t('onRequest') },
  ];

  return (
    <>
      <Navigation />
      <main>
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

        <section className="pt-6 pb-20">
          <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <PartImage
                src={part.image}
                alt={part.name}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[4/3] w-full border border-secondary/10"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary/50 mb-4">
                <span className="inline-block w-6 h-px bg-primary align-middle mr-3" />
                {model.brand} {model.designation}
              </p>
              <h1 className="font-display font-bold uppercase text-5xl md:text-6xl leading-[0.95] tracking-tight mb-5 text-balance">
                {part.name}
              </h1>
              {part.description && (
                <p className="text-lg text-secondary/75 leading-relaxed mb-8 whitespace-pre-line">{part.description}</p>
              )}

              <dl className="border-t border-secondary/15 mb-8">
                {specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[8rem_1fr] gap-4 py-3 border-b border-secondary/15">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-secondary/50 pt-1">{spec.label}</dt>
                    <dd className="font-medium">
                      {spec.href ? (
                        <Link href={spec.href} className="hover:text-primary transition-colors">
                          {spec.value}
                        </Link>
                      ) : (
                        spec.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  as={Link}
                  href={`/${locale}/contact?message=${encodeURIComponent(contactMessage)}`}
                  color="primary"
                  size="lg"
                  radius="sm"
                  endContent={<ArrowRight size={18} />}
                  className="font-semibold px-7"
                >
                  {t('interestedContact')}
                </Button>
                <Button
                  as={Link}
                  href={`/${locale}/categories/${category.id}/${model.id}`}
                  variant="bordered"
                  size="lg"
                  radius="sm"
                  startContent={<ArrowLeft size={18} />}
                  className="font-semibold border-1 border-secondary/25 text-secondary"
                >
                  {t('backToParts')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
