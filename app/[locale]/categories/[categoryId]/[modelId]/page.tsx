import { notFound } from 'next/navigation';
import ModelView from '@/components/views/ModelView';
import { findCategory } from '@/lib/catalog-server';

export default async function ModelPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string; modelId: string }>;
}) {
  const { locale, categoryId, modelId } = await params;
  const category = await findCategory(locale, categoryId);
  const model = category?.models.find((m) => m.id === modelId);
  if (!category || !model) notFound();
  return <ModelView category={category} model={model} />;
}
