import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from './providers';
import { Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/catalog-server';

const fontSans = Barlow({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const fontDisplay = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

const localeMetadata: Record<string, { title: string; description: string }> = {
  de: {
    title: 'Tornado Racing Moto – Nockenwellen & Speedway-Motorteile',
    description:
      'Tornado-Nockenwellen, Ventile, Ventilfedern, Kolben, Pleuel und PVL-Zündungen für Speedway-Motoren von Jawa und GM. Beratung auf Deutsch, Englisch und Polnisch, Versand in die EU.',
  },
  en: {
    title: 'Tornado Racing Moto – Camshafts & Speedway Engine Parts',
    description:
      'Tornado camshafts, valves, valve springs, pistons, con rods and PVL ignitions for Jawa and GM speedway engines. Support in German, English and Polish, shipping within the EU.',
  },
  pl: {
    title: 'Tornado Racing Moto – Wałki rozrządu i części silników żużlowych',
    description:
      'Krzywki Tornado, zawory, sprężyny zaworowe, tłoki, korbowody i zapłony PVL do silników żużlowych Jawa i GM. Obsługa po polsku, niemiecku i angielsku, wysyłka w UE.',
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
    title: { default: meta.title, template: '%s | Tornado Racing Moto' },
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
      type: 'website',
      siteName: 'Tornado Racing Moto',
      url: `${BASE_URL}/${locale}`,
      title: meta.title,
      description: meta.description,
      images: [DEFAULT_OG_IMAGE],
      locale: locale === 'de' ? 'de_DE' : locale === 'en' ? 'en_US' : 'pl_PL',
      alternateLocale: ['de_DE', 'en_US', 'pl_PL'].filter(
        (l) => l !== (locale === 'de' ? 'de_DE' : locale === 'en' ? 'en_US' : 'pl_PL')
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [DEFAULT_OG_IMAGE.url],
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
    <html lang={locale} className={`light ${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
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
      <body className="font-sans antialiased bg-white text-secondary">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
