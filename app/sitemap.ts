import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://tornado-racing-moto.vercel.app';
const locales = ['de', 'en', 'pl'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = ['', '/categories', '/about', '/contact'];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            de: `${BASE_URL}/de${page}`,
            en: `${BASE_URL}/en${page}`,
            pl: `${BASE_URL}/pl${page}`,
          },
        },
      });
    }
  }

  // Dynamic category pages
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id, updated_at');

    if (categories) {
      for (const category of categories) {
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/categories/${category.id}`,
            lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: {
                de: `${BASE_URL}/de/categories/${category.id}`,
                en: `${BASE_URL}/en/categories/${category.id}`,
                pl: `${BASE_URL}/pl/categories/${category.id}`,
              },
            },
          });
        }
      }
    }

    // Dynamic model pages
    const { data: models } = await supabase
      .from('models')
      .select('id, category_id, updated_at');

    if (models) {
      for (const model of models) {
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/categories/${model.category_id}/${model.id}`,
            lastModified: model.updated_at ? new Date(model.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: {
                de: `${BASE_URL}/de/categories/${model.category_id}/${model.id}`,
                en: `${BASE_URL}/en/categories/${model.category_id}/${model.id}`,
                pl: `${BASE_URL}/pl/categories/${model.category_id}/${model.id}`,
              },
            },
          });
        }
      }
    }

    // Dynamic part pages
    const { data: parts } = await supabase
      .from('parts')
      .select('id, model_id, updated_at');

    if (parts && models) {
      for (const part of parts) {
        const model = models.find((m) => m.id === part.model_id);
        if (model) {
          for (const locale of locales) {
            entries.push({
              url: `${BASE_URL}/${locale}/categories/${model.category_id}/${model.id}/${part.id}`,
              lastModified: part.updated_at ? new Date(part.updated_at) : new Date(),
              changeFrequency: 'monthly',
              priority: 0.5,
              alternates: {
                languages: {
                  de: `${BASE_URL}/de/categories/${model.category_id}/${model.id}/${part.id}`,
                  en: `${BASE_URL}/en/categories/${model.category_id}/${model.id}/${part.id}`,
                  pl: `${BASE_URL}/pl/categories/${model.category_id}/${model.id}/${part.id}`,
                },
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return entries;
}
