import CatalogView from '@/components/views/CatalogView';
import { loadCatalog } from '@/lib/catalog-server';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const categories = await loadCatalog(locale);
  return <CatalogView categories={categories} />;
}
