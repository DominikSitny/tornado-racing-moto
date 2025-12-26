import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

const localeMetadata: Record<string, { title: string; description: string }> = {
  de: {
    title: 'Tornado Racing Moto - Motorradteile & Zubehör',
    description: 'Hochwertige Motorradkomponenten und Zubehör für alle Marken. Ersatzteile, Performance-Parts und Zubehör für Motorräder. Schnelle Lieferung.',
  },
  en: {
    title: 'Tornado Racing Moto - Motorcycle Parts & Accessories',
    description: 'High-quality motorcycle components and accessories for all brands. Spare parts, performance parts and accessories for motorcycles. Fast delivery.',
  },
  pl: {
    title: 'Tornado Racing Moto - Części Motocyklowe i Akcesoria',
    description: 'Wysokiej jakości części i akcesoria motocyklowe dla wszystkich marek. Części zamienne, części sportowe i akcesoria. Szybka dostawa.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMetadata[locale] || localeMetadata.de;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
        pl: `${BASE_URL}/pl`,
      },
    },
    openGraph: {
      locale: locale === 'de' ? 'de_DE' : locale === 'en' ? 'en_US' : 'pl_PL',
      alternateLocale: ['de_DE', 'en_US', 'pl_PL'].filter(
        (l) => l !== (locale === 'de' ? 'de_DE' : locale === 'en' ? 'en_US' : 'pl_PL')
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  // JSON-LD Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tornado Racing Moto',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.jpeg`,
    sameAs: [
      'https://instagram.com/tornadoracingmoto',
      'https://www.facebook.com/p/Tornado-Racing-Moto-100054281929959/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'tornado-racing-moto@wp.pl',
      contactType: 'customer service',
      availableLanguage: ['German', 'English', 'Polish'],
    },
  };

  // JSON-LD for WebSite with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tornado Racing Moto',
    url: BASE_URL,
    inLanguage: locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'pl-PL',
  };

  return (
    <html lang={locale} className="light">
      <head>
        <link rel="alternate" hrefLang="de" href={`${BASE_URL}/de`} />
        <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en`} />
        <link rel="alternate" hrefLang="pl" href={`${BASE_URL}/pl`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/de`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
