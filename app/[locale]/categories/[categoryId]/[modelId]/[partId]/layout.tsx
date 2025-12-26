import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

type Locale = 'de' | 'en' | 'pl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string; modelId: string; partId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId, modelId, partId } = await params;

  // Fetch part data
  const { data: part } = await supabase
    .from('parts')
    .select('name, name_en, name_pl, description, description_en, description_pl, image')
    .eq('id', partId)
    .single();

  // Fetch model for context
  const { data: model } = await supabase
    .from('models')
    .select('brand, designation')
    .eq('id', modelId)
    .single();

  if (!part) {
    return {
      title: 'Teil nicht gefunden',
    };
  }

  const getName = (loc: Locale) => {
    if (loc === 'en' && part.name_en) return part.name_en;
    if (loc === 'pl' && part.name_pl) return part.name_pl;
    return part.name;
  };

  const getDescription = (loc: Locale) => {
    if (loc === 'en' && part.description_en) return part.description_en;
    if (loc === 'pl' && part.description_pl) return part.description_pl;
    return part.description;
  };

  const name = getName(locale as Locale);
  const description = getDescription(locale as Locale);
  const modelName = model ? `${model.brand} ${model.designation}` : '';

  const metaTitle = modelName ? `${name} - ${modelName}` : name;

  return {
    title: metaTitle,
    description: description || `${name} für ${modelName} - Tornado Racing Moto`,
    alternates: {
      canonical: `${BASE_URL}/${locale}/categories/${categoryId}/${modelId}/${partId}`,
      languages: {
        de: `${BASE_URL}/de/categories/${categoryId}/${modelId}/${partId}`,
        en: `${BASE_URL}/en/categories/${categoryId}/${modelId}/${partId}`,
        pl: `${BASE_URL}/pl/categories/${categoryId}/${modelId}/${partId}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: description || `${name} für ${modelName}`,
      images: part.image ? [{ url: part.image, alt: name }] : undefined,
    },
  };
}

export default function PartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
