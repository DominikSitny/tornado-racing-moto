import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getPrivacy } from '@/lib/legal-content';
import { BASE_URL, toLocale } from '@/lib/catalog-server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getPrivacy(toLocale(locale));
  return {
    title: doc.title,
    alternates: {
      canonical: `${BASE_URL}/${locale}/datenschutz`,
      languages: { de: `${BASE_URL}/de/datenschutz`, en: `${BASE_URL}/en/datenschutz`, pl: `${BASE_URL}/pl/datenschutz` },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalPage doc={getPrivacy(toLocale(locale))} />;
}
