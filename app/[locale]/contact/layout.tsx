import type { Metadata } from 'next';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

const contactMeta: Record<string, { title: string; description: string }> = {
  de: {
    title: 'Kontakt',
    description: 'Kontaktieren Sie Tornado Racing Moto. Wir helfen Ihnen gerne bei Fragen zu Motorradteilen und Zubehör. Email, Telefon und Social Media.',
  },
  en: {
    title: 'Contact',
    description: 'Contact Tornado Racing Moto. We are happy to help with questions about motorcycle parts and accessories. Email, phone and social media.',
  },
  pl: {
    title: 'Kontakt',
    description: 'Skontaktuj się z Tornado Racing Moto. Chętnie pomożemy w kwestiach dotyczących części i akcesoriów motocyklowych. Email, telefon i media społecznościowe.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = contactMeta[locale] || contactMeta.de;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        de: `${BASE_URL}/de/contact`,
        en: `${BASE_URL}/en/contact`,
        pl: `${BASE_URL}/pl/contact`,
      },
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
