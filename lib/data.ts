import { Catalog, Category, Model, Part } from './types';
import catalogData from '@/data/catalog.json';

export function getCatalog(): Catalog {
  return catalogData as Catalog;
}

export function getAllCategories(): Category[] {
  return catalogData.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return catalogData.categories.find((cat) => cat.id === id);
}

export function getModelById(
  categoryId: string,
  modelId: string
): Model | undefined {
  const category = getCategoryById(categoryId);
  return category?.models.find((model) => model.id === modelId);
}

export function getPartById(
  categoryId: string,
  modelId: string,
  partId: string
): Part | undefined {
  const model = getModelById(categoryId, modelId);
  return model?.parts.find((part) => part.id === partId);
}

// Generate static params for dynamic routes
export function getAllCategoryIds(): string[] {
  return catalogData.categories.map((cat) => cat.id);
}

export function getAllModelIds(categoryId: string): string[] {
  const category = getCategoryById(categoryId);
  return category?.models.map((model) => model.id) || [];
}

export function getAllPartIds(categoryId: string, modelId: string): string[] {
  const model = getModelById(categoryId, modelId);
  return model?.parts.map((part) => part.id) || [];
}
