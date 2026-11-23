import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getImprint } from '@/lib/legal-content';
import { BASE_URL, toLocale } from '@/lib/catalog-server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getImprint(toLocale(locale));
  return {
    title: doc.title,
    alternates: {
      canonical: `${BASE_URL}/${locale}/impressum`,
      languages: { de: `${BASE_URL}/de/impressum`, en: `${BASE_URL}/en/impressum`, pl: `${BASE_URL}/pl/impressum` },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalPage doc={getImprint(toLocale(locale))} />;
}
