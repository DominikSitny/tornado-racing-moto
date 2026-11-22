import { notFound } from 'next/navigation';
import CategoryView from '@/components/views/CategoryView';
import { findCategory } from '@/lib/catalog-server';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { locale, categoryId } = await params;
  const category = await findCategory(locale, categoryId);
  if (!category) notFound();
  return <CategoryView category={category} />;
}
