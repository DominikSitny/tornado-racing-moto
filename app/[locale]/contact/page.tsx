'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageHeader from '@/components/PageHeader';
import { Spinner } from '@nextui-org/react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { contactInfo, phoneHref } from '@/lib/contact-info';

function ContactFormWithPrefill() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message') || '';
  return <ContactForm initialMessage={initialMessage} />;
}

export default function ContactPage() {
  const t = useTranslations('contact');
  const tNav = useTranslations('navigation');

  const channels = [
    { label: t('email'), value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    ...(contactInfo.phone ? [{ label: t('phone'), value: contactInfo.phone, href: phoneHref(contactInfo.phone) }] : []),
    { label: 'Instagram', value: contactInfo.instagram.handle, href: contactInfo.instagram.url, external: true },
    { label: 'Facebook', value: contactInfo.facebook.name, href: contactInfo.facebook.url, external: true },
  ];

  const hints = [t('hint1'), t('hint2'), t('hint3')];

  return (
    <>
      <Navigation />
      <main>
        <PageHeader breadcrumb={[{ label: tNav('contact') }]} title={t('title')} lead={t('subtitle')} />

        <section className="py-14 md:py-20">
          <div className="container grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-secondary/50 mb-6">
                <span className="text-primary">01</span> / {t('formTitle')}
              </h2>
              <Suspense
                fallback={
                  <div className="flex justify-center py-12">
                    <Spinner color="primary" />
                  </div>
                }
              >
                <ContactFormWithPrefill />
              </Suspense>
            </div>

            <aside className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-secondary/50 mb-6">
                  <span className="text-primary">02</span> / {t('detailsTitle')}
                </h2>
                <ul className="border-t border-secondary/15">
                  {channels.map((channel) => (
                    <li key={channel.label} className="border-b border-secondary/15">
                      <a
                        href={channel.href}
                        {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="group flex items-center justify-between gap-4 py-4"
                      >
                        <span className="min-w-0">
                          <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/50">{channel.label}</span>
                          <span className="block font-medium text-lg break-all group-hover:text-primary transition-colors">{channel.value}</span>
                        </span>
                        <ArrowUpRight size={18} className="shrink-0 text-secondary/40 group-hover:text-primary transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 border border-secondary/10 p-6">
                <h2 className="font-display font-semibold uppercase text-xl tracking-tight mb-4">{t('hintTitle')}</h2>
                <ul className="space-y-2">
                  {hints.map((hint, i) => (
                    <li key={hint} className="flex gap-3 text-secondary/75">
                      <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
