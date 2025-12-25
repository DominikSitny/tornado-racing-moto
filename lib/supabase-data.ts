import { supabase } from './supabase';
import { Category, Model, Part, Locale } from './types';

// Helper: Get localized text
function getLocalizedText(base: string, en: string | null, pl: string | null, locale: Locale): string {
  if (locale === 'en' && en) return en;
  if (locale === 'pl' && pl) return pl;
  return base || '';
}

// Alle Kategorien mit Modellen und Teilen laden (mit Locale)
export async function getAllCategoriesFromDb(locale: Locale = 'de'): Promise<Category[]> {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (catError || !categories) {
    console.error('Error loading categories:', catError);
    return [];
  }

  const { data: models, error: modelError } = await supabase
    .from('models')
    .select('*')
    .order('brand');

  if (modelError) {
    console.error('Error loading models:', modelError);
  }

  const { data: parts, error: partError } = await supabase
    .from('parts')
    .select('*')
    .order('name');

  if (partError) {
    console.error('Error loading parts:', partError);
  }

  // Daten zusammenführen mit Lokalisierung
  return categories.map((cat) => ({
    id: cat.id,
    name: getLocalizedText(cat.name, cat.name_en, cat.name_pl, locale),
    name_en: cat.name_en || '',
    name_pl: cat.name_pl || '',
    description: getLocalizedText(cat.description, cat.description_en, cat.description_pl, locale),
    description_en: cat.description_en || '',
    description_pl: cat.description_pl || '',
    models: (models || [])
      .filter((m) => m.category_id === cat.id)
      .map((model) => ({
        id: model.id,
        brand: model.brand,
        designation: model.designation,
        description: getLocalizedText(model.description, model.description_en, model.description_pl, locale),
        description_en: model.description_en || '',
        description_pl: model.description_pl || '',
        parts: (parts || [])
          .filter((p) => p.model_id === model.id)
          .map((part) => ({
            id: part.id,
            name: getLocalizedText(part.name, part.name_en, part.name_pl, locale),
            name_en: part.name_en || '',
            name_pl: part.name_pl || '',
            description: getLocalizedText(part.description, part.description_en, part.description_pl, locale),
            description_en: part.description_en || '',
            description_pl: part.description_pl || '',
            image: part.image || '',
          })),
      })),
  }));
}

// Alle Kategorien RAW (für Admin - ohne Lokalisierung)
export async function getAllCategoriesRaw(): Promise<Category[]> {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (catError || !categories) {
    console.error('Error loading categories:', catError);
    return [];
  }

  const { data: models, error: modelError } = await supabase
    .from('models')
    .select('*')
    .order('brand');

  if (modelError) {
    console.error('Error loading models:', modelError);
  }

  const { data: parts, error: partError } = await supabase
    .from('parts')
    .select('*')
    .order('name');

  if (partError) {
    console.error('Error loading parts:', partError);
  }

  // Daten zusammenführen (alle Felder)
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name || '',
    name_en: cat.name_en || '',
    name_pl: cat.name_pl || '',
    description: cat.description || '',
    description_en: cat.description_en || '',
    description_pl: cat.description_pl || '',
    models: (models || [])
      .filter((m) => m.category_id === cat.id)
      .map((model) => ({
        id: model.id,
        brand: model.brand,
        designation: model.designation,
        description: model.description || '',
        description_en: model.description_en || '',
        description_pl: model.description_pl || '',
        parts: (parts || [])
          .filter((p) => p.model_id === model.id)
          .map((part) => ({
            id: part.id,
            name: part.name || '',
            name_en: part.name_en || '',
            name_pl: part.name_pl || '',
            description: part.description || '',
            description_en: part.description_en || '',
            description_pl: part.description_pl || '',
            image: part.image || '',
          })),
      })),
  }));
}

// Kategorie nach ID
export async function getCategoryByIdFromDb(id: string, locale: Locale = 'de'): Promise<Category | null> {
  const categories = await getAllCategoriesFromDb(locale);
  return categories.find((c) => c.id === id) || null;
}

// Modell nach ID
export async function getModelByIdFromDb(categoryId: string, modelId: string, locale: Locale = 'de'): Promise<Model | null> {
  const category = await getCategoryByIdFromDb(categoryId, locale);
  return category?.models.find((m) => m.id === modelId) || null;
}

// Teil nach ID
export async function getPartByIdFromDb(categoryId: string, modelId: string, partId: string, locale: Locale = 'de'): Promise<Part | null> {
  const model = await getModelByIdFromDb(categoryId, modelId, locale);
  return model?.parts.find((p) => p.id === partId) || null;
}

// === CRUD Operationen (mit Mehrsprachigkeit) ===

interface CategoryData {
  name: string;
  name_en?: string;
  name_pl?: string;
  description: string;
  description_en?: string;
  description_pl?: string;
}

interface ModelData {
  brand: string;
  designation: string;
  description: string;
  description_en?: string;
  description_pl?: string;
}

interface PartData {
  name: string;
  name_en?: string;
  name_pl?: string;
  description: string;
  description_en?: string;
  description_pl?: string;
  image: string;
}

// Kategorie erstellen
export async function createCategory(category: { id: string } & CategoryData) {
  const { error } = await supabase.from('categories').insert(category);
  if (error) throw error;
}

// Kategorie aktualisieren
export async function updateCategory(id: string, data: CategoryData) {
  const { error } = await supabase.from('categories').update(data).eq('id', id);
  if (error) throw error;
}

// Kategorie löschen
export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Modell erstellen
export async function createModel(model: { id: string; category_id: string } & ModelData) {
  const { error } = await supabase.from('models').insert(model);
  if (error) throw error;
}

// Modell aktualisieren
export async function updateModel(id: string, data: ModelData) {
  const { error } = await supabase.from('models').update(data).eq('id', id);
  if (error) throw error;
}

// Modell löschen
export async function deleteModel(id: string) {
  const { error } = await supabase.from('models').delete().eq('id', id);
  if (error) throw error;
}

// Teil erstellen
export async function createPart(part: { id: string; model_id: string } & PartData) {
  const { error } = await supabase.from('parts').insert(part);
  if (error) throw error;
}

// Teil aktualisieren
export async function updatePart(id: string, data: PartData) {
  const { error } = await supabase.from('parts').update(data).eq('id', id);
  if (error) throw error;
}

// Teil löschen
export async function deletePart(id: string) {
  const { error } = await supabase.from('parts').delete().eq('id', id);
  if (error) throw error;
}

// Bild hochladen
export async function uploadImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;

  const { error } = await supabase.storage
    .from('parts')
    .upload(filename, file);

  if (error) throw error;

  const { data } = supabase.storage.from('parts').getPublicUrl(filename);
  return data.publicUrl;
}

// Admin Passwort prüfen
export async function checkAdminPassword(password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_password')
    .single();

  if (error || !data) return false;
  return data.value === password;
}
