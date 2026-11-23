import { getAllCategoriesFromDb } from '@/lib/supabase-data';
import { Locale } from '@/lib/types';

export const BASE_URL = 'https://tornado-racing-moto.vercel.app';

/** Preview image for shared links (WhatsApp, Facebook, …). Must be repeated in every openGraph block,
 *  because a child segment's openGraph replaces the parent's completely. */
export const DEFAULT_OG_IMAGE = {
  url: '/images/site/og-speedway.jpg',
  width: 1200,
  height: 630,
  alt: 'Speedway – Tornado Racing Moto',
};

const LOCALES: Locale[] = ['de', 'en', 'pl'];
export const toLocale = (value: string): Locale => (LOCALES.includes(value as Locale) ? (value as Locale) : 'de');

/** Loads the localized catalog on the server, so the HTML already contains all content. */
export async function loadCatalog(locale: string) {
  return getAllCategoriesFromDb(toLocale(locale));
}

export async function findCategory(locale: string, categoryId: string) {
  const categories = await loadCatalog(locale);
  return categories.find((c) => c.id === categoryId) ?? null;
}

/** Short plain-text description for search results (max ~160 characters, no line breaks). */
export function metaDescription(text: string | undefined | null, fallback: string) {
  const plain = (text || fallback).replace(/\s+/g, ' ').trim();
  return plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}…` : plain;
}

/** Embeds structured data (JSON-LD) for search engines. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
