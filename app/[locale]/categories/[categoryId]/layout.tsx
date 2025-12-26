import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

type Locale = 'de' | 'en' | 'pl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId } = await params;

  // Fetch category data
  const { data: category } = await supabase
    .from('categories')
    .select('name, name_en, name_pl, description, description_en, description_pl')
    .eq('id', categoryId)
    .single();

  if (!category) {
    return {
      title: 'Kategorie nicht gefunden',
    };
  }

  const getName = (loc: Locale) => {
    if (loc === 'en' && category.name_en) return category.name_en;
    if (loc === 'pl' && category.name_pl) return category.name_pl;
    return category.name;
  };

  const getDescription = (loc: Locale) => {
    if (loc === 'en' && category.description_en) return category.description_en;
    if (loc === 'pl' && category.description_pl) return category.description_pl;
    return category.description;
  };

  const name = getName(locale as Locale);
  const description = getDescription(locale as Locale);

  return {
    title: name,
    description: description || `${name} - Motorradteile bei Tornado Racing Moto`,
    alternates: {
      canonical: `${BASE_URL}/${locale}/categories/${categoryId}`,
      languages: {
        de: `${BASE_URL}/de/categories/${categoryId}`,
        en: `${BASE_URL}/en/categories/${categoryId}`,
        pl: `${BASE_URL}/pl/categories/${categoryId}`,
      },
    },
    openGraph: {
      title: name,
      description: description || `${name} - Motorradteile`,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
