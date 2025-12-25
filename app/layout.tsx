import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tornado Racing Moto - Produktkatalog",
  description: "Hochwertige Motorradkomponenten und Zubehör",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="light">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
