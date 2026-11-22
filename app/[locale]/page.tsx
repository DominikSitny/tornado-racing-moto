import HomeView from '@/components/views/HomeView';
import { loadCatalog } from '@/lib/catalog-server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const categories = await loadCatalog(locale);
  return <HomeView categories={categories} />;
}
