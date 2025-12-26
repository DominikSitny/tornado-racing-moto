import type { Metadata } from 'next';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';

const aboutMeta: Record<string, { title: string; description: string }> = {
  de: {
    title: 'Über uns',
    description: 'Erfahren Sie mehr über Tornado Racing Moto - Ihr Partner für hochwertige Motorradteile und Zubehör. Unsere Geschichte, Mission und Werte.',
  },
  en: {
    title: 'About Us',
    description: 'Learn more about Tornado Racing Moto - your partner for high-quality motorcycle parts and accessories. Our story, mission and values.',
  },
  pl: {
    title: 'O nas',
    description: 'Dowiedz się więcej o Tornado Racing Moto - Twoim partnerze w dziedzinie wysokiej jakości części i akcesoriów motocyklowych. Nasza historia, misja i wartości.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = aboutMeta[locale] || aboutMeta.de;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        de: `${BASE_URL}/de/about`,
        en: `${BASE_URL}/en/about`,
        pl: `${BASE_URL}/pl/about`,
      },
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
