import type { Metadata } from 'next';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

const catalogMeta: Record<string, { title: string; description: string }> = {
  de: {
    title: 'Produktkatalog - Motorradteile',
    description: 'Durchsuchen Sie unseren umfangreichen Katalog an Motorradteilen und Zubehör. Qualitätskomponenten für alle Marken und Modelle.',
  },
  en: {
    title: 'Product Catalog - Motorcycle Parts',
    description: 'Browse our extensive catalog of motorcycle parts and accessories. Quality components for all brands and models.',
  },
  pl: {
    title: 'Katalog Produktów - Części Motocyklowe',
    description: 'Przeglądaj nasz obszerny katalog części i akcesoriów motocyklowych. Komponenty wysokiej jakości dla wszystkich marek i modeli.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = catalogMeta[locale] || catalogMeta.de;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/categories`,
      languages: {
        de: `${BASE_URL}/de/categories`,
        en: `${BASE_URL}/en/categories`,
        pl: `${BASE_URL}/pl/categories`,
      },
    },
  };
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
