import { supabase } from './supabase';
import { Category, Model, Part } from './types';

// Alle Kategorien mit Modellen und Teilen laden
export async function getAllCategoriesFromDb(): Promise<Category[]> {
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

  // Daten zusammenführen
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || '',
    models: (models || [])
      .filter((m) => m.category_id === cat.id)
      .map((model) => ({
        id: model.id,
        brand: model.brand,
        designation: model.designation,
        description: model.description || '',
        parts: (parts || [])
          .filter((p) => p.model_id === model.id)
          .map((part) => ({
            id: part.id,
            name: part.name,
            description: part.description || '',
            image: part.image || '',
          })),
      })),
  }));
}

// Kategorie nach ID
export async function getCategoryByIdFromDb(id: string): Promise<Category | null> {
  const categories = await getAllCategoriesFromDb();
  return categories.find((c) => c.id === id) || null;
}

// Modell nach ID
export async function getModelByIdFromDb(categoryId: string, modelId: string): Promise<Model | null> {
  const category = await getCategoryByIdFromDb(categoryId);
  return category?.models.find((m) => m.id === modelId) || null;
}

// Teil nach ID
export async function getPartByIdFromDb(categoryId: string, modelId: string, partId: string): Promise<Part | null> {
  const model = await getModelByIdFromDb(categoryId, modelId);
  return model?.parts.find((p) => p.id === partId) || null;
}

// === CRUD Operationen ===

// Kategorie erstellen
export async function createCategory(category: { id: string; name: string; description: string }) {
  const { error } = await supabase.from('categories').insert(category);
  if (error) throw error;
}

// Kategorie aktualisieren
export async function updateCategory(id: string, data: { name: string; description: string }) {
  const { error } = await supabase.from('categories').update(data).eq('id', id);
  if (error) throw error;
}

// Kategorie löschen
export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Modell erstellen
export async function createModel(model: { id: string; category_id: string; brand: string; designation: string; description: string }) {
  const { error } = await supabase.from('models').insert(model);
  if (error) throw error;
}

// Modell aktualisieren
export async function updateModel(id: string, data: { brand: string; designation: string; description: string }) {
  const { error } = await supabase.from('models').update(data).eq('id', id);
  if (error) throw error;
}

// Modell löschen
export async function deleteModel(id: string) {
  const { error } = await supabase.from('models').delete().eq('id', id);
  if (error) throw error;
}

// Teil erstellen
export async function createPart(part: { id: string; model_id: string; name: string; description: string; image: string }) {
  const { error } = await supabase.from('parts').insert(part);
  if (error) throw error;
}

// Teil aktualisieren
export async function updatePart(id: string, data: { name: string; description: string; image: string }) {
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
