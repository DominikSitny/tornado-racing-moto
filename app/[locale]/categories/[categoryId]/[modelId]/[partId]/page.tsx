import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import PartView from '@/components/views/PartView';
import { BASE_URL, findCategory, jsonLd } from '@/lib/catalog-server';

export default async function PartPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string; modelId: string; partId: string }>;
}) {
  const { locale, categoryId, modelId, partId } = await params;
  const category = await findCategory(locale, categoryId);
  const model = category?.models.find((m) => m.id === modelId);
  const part = model?.parts.find((p) => p.id === partId);
  if (!category || !model || !part) notFound();

  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  const modelName = `${model.brand} ${model.designation}`.trim();
  const base = `${BASE_URL}/${locale}`;
  const url = `${base}/categories/${category.id}/${model.id}/${part.id}`;

  // Structured data: tells Google this page is a product and where it sits in the catalog
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.name,
    description: part.description,
    url,
    ...(part.image ? { image: [part.image] } : {}),
    sku: part.id,
    brand: { '@type': 'Brand', name: 'Tornado Racing Cams' },
    category: `${category.name} > ${modelName}`,
    isRelatedTo: { '@type': 'Product', name: modelName },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: tNav('home'), item: base },
      { name: tNav('catalog'), item: `${base}/categories` },
      { name: category.name, item: `${base}/categories/${category.id}` },
      { name: modelName, item: `${base}/categories/${category.id}/${model.id}` },
      { name: part.name, item: url },
    ].map((entry, i) => ({ '@type': 'ListItem', position: i + 1, ...entry })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(product)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      <PartView category={category} model={model} part={part} />
    </>
  );
}
