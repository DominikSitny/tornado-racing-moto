import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const BASE_URL = "https://tornado-racing-moto.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tornado Racing Moto - Motorradteile & Zubehör",
    template: "%s | Tornado Racing Moto",
  },
  description:
    "Hochwertige Motorradkomponenten und Zubehör für alle Marken. Ersatzteile, Performance-Parts und Zubehör für Motorräder. Schnelle Lieferung in DE, PL, EU.",
  keywords: [
    "Motorradteile",
    "Motorrad Ersatzteile",
    "Motorcycle parts",
    "Części motocyklowe",
    "Motorrad Zubehör",
    "Racing Parts",
    "Tornado Racing",
    "Motorradkomponenten",
  ],
  authors: [{ name: "Tornado Racing Moto" }],
  creator: "Tornado Racing Moto",
  publisher: "Tornado Racing Moto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_US", "pl_PL"],
    url: BASE_URL,
    siteName: "Tornado Racing Moto",
    title: "Tornado Racing Moto - Motorradteile & Zubehör",
    description:
      "Hochwertige Motorradkomponenten und Zubehör für alle Marken. Ersatzteile, Performance-Parts und Zubehör für Motorräder.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Tornado Racing Moto Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tornado Racing Moto - Motorradteile & Zubehör",
    description:
      "Hochwertige Motorradkomponenten und Zubehör für alle Marken.",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      de: `${BASE_URL}/de`,
      en: `${BASE_URL}/en`,
      pl: `${BASE_URL}/pl`,
    },
  },
  category: "Automotive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
