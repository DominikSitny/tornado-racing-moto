import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

type Locale = 'de' | 'en' | 'pl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string; modelId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId, modelId } = await params;

  // Fetch model data
  const { data: model } = await supabase
    .from('models')
    .select('brand, designation, description, description_en, description_pl')
    .eq('id', modelId)
    .single();

  if (!model) {
    return {
      title: 'Modell nicht gefunden',
    };
  }

  const getDescription = (loc: Locale) => {
    if (loc === 'en' && model.description_en) return model.description_en;
    if (loc === 'pl' && model.description_pl) return model.description_pl;
    return model.description;
  };

  const title = `${model.brand} ${model.designation}`;
  const description = getDescription(locale as Locale);

  const metaDescriptions: Record<Locale, string> = {
    de: `Ersatzteile und Zubehör für ${title}. Hochwertige Komponenten bei Tornado Racing Moto.`,
    en: `Spare parts and accessories for ${title}. High-quality components at Tornado Racing Moto.`,
    pl: `Części zamienne i akcesoria do ${title}. Komponenty wysokiej jakości w Tornado Racing Moto.`,
  };

  return {
    title: title,
    description: description || metaDescriptions[locale as Locale] || metaDescriptions.de,
    alternates: {
      canonical: `${BASE_URL}/${locale}/categories/${categoryId}/${modelId}`,
      languages: {
        de: `${BASE_URL}/de/categories/${categoryId}/${modelId}`,
        en: `${BASE_URL}/en/categories/${categoryId}/${modelId}`,
        pl: `${BASE_URL}/pl/categories/${categoryId}/${modelId}`,
      },
    },
    openGraph: {
      title: title,
      description: description || metaDescriptions[locale as Locale] || metaDescriptions.de,
    },
  };
}

export default function ModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
