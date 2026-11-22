import { supabase } from './supabase';
import { Category, Model, Part, Locale } from './types';

// Helper: Get localized text
function getLocalizedText(base: string, en: string | null, pl: string | null, locale: Locale): string {
  if (locale === 'en' && en) return en;
  if (locale === 'pl' && pl) return pl;
  return base || '';
}

// Natürliche Sortierung: „Teil 3.2“ vor „Teil 3.10“, Groß-/Kleinschreibung egal
const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });
const byName = (a: { name: string }, b: { name: string }) => collator.compare(a.name ?? '', b.name ?? '');
const byModel = (a: { brand: string; designation: string }, b: { brand: string; designation: string }) =>
  collator.compare(`${a.brand ?? ''} ${a.designation ?? ''}`, `${b.brand ?? ''} ${b.designation ?? ''}`);

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

  categories.sort(byName);
  models?.sort(byModel);
  parts?.sort(byName);

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

  categories.sort(byName);
  models?.sort(byModel);
  parts?.sort(byName);

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

// ---------------------------------------------------------------------------
// Admin: Schreiben mit Prüfung und verständlichen Fehlermeldungen
// ---------------------------------------------------------------------------

/** Fehler, dessen Meldung direkt im Admin-Bereich angezeigt werden kann. */
export class AdminError extends Error {
  constructor(
    message: string,
    /** Formularfeld, auf das sich der Fehler bezieht (z. B. 'name'). */
    public field?: string,
    public status = 400,
    /** Technische Details für die Fehlersuche. */
    public details?: string
  ) {
    super(message);
    this.name = 'AdminError';
  }
}

type Entity = 'category' | 'model' | 'part';

const ENTITY_LABEL: Record<Entity, string> = { category: 'Kategorie', model: 'Modell', part: 'Teil' };
/** German grammar per entity: „diese Kategorie … sie“ vs. „dieses Teil … es“. */
const GRAMMAR: Record<Entity, { the: string; this: string; it: string }> = {
  category: { the: 'Die', this: 'Diese', it: 'sie' },
  model: { the: 'Das', this: 'Dieses', it: 'es' },
  part: { the: 'Das', this: 'Dieses', it: 'es' },
};
const CHILD_LABEL: Partial<Record<Entity, string>> = { category: 'Modelle', model: 'Teile' };
const TABLE: Record<Entity, string> = { category: 'categories', model: 'models', part: 'parts' };

/** Macht aus einem Namen eine URL-taugliche ID: „Ölfilter Ø 80“ → „oelfilter-80“. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/** Findet eine freie ID: „nockenwelle“, sonst „nockenwelle-2“, „nockenwelle-3“ … */
async function uniqueId(entity: Entity, base: string): Promise<string> {
  const root = base || ENTITY_LABEL[entity].toLowerCase();
  const { data, error } = await supabase.from(TABLE[entity]).select('id').like('id', `${root}%`);
  if (error) throw translateDbError(error, entity, 'create');
  const taken = new Set((data ?? []).map((row: { id: string }) => row.id));
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

function required(value: string | undefined, field: string, label: string): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) throw new AdminError(`Bitte fülle das Feld „${label}“ aus.`, field);
  return trimmed;
}

const same = (a: string, b: string) => a.trim().toLocaleLowerCase('de') === b.trim().toLocaleLowerCase('de');

/** Übersetzt Supabase-/Postgres-Fehler in eine Meldung, mit der man etwas anfangen kann. */
export function translateDbError(
  error: { code?: string; message?: string; details?: string | null },
  entity: Entity,
  action: 'create' | 'update' | 'delete'
): AdminError {
  const label = ENTITY_LABEL[entity];
  const g = GRAMMAR[entity];
  const details = [error.code, error.message, error.details].filter(Boolean).join(' – ');

  switch (error.code) {
    case '23505':
      return new AdminError(`${g.this} ${label} gibt es bereits.`, undefined, 409, details);
    case '23503':
      if (action === 'delete') {
        const children = CHILD_LABEL[entity] ?? 'Einträge';
        return new AdminError(
          `${g.this} ${label} kann nicht gelöscht werden, weil noch ${children} dazugehören. Lösche zuerst die ${children}.`,
          undefined,
          409,
          details
        );
      }
      return new AdminError(
        'Der übergeordnete Eintrag existiert nicht mehr. Bitte klicke auf „Aktualisieren“ und versuche es erneut.',
        undefined,
        409,
        details
      );
    case '23502': {
      const column = error.message?.match(/column "([^"]+)"/)?.[1];
      return new AdminError(`Ein Pflichtfeld fehlt${column ? ` („${column}“)` : ''}.`, column, 400, details);
    }
    case '22001':
      return new AdminError('Ein Text ist zu lang. Bitte kürze Name oder Beschreibung.', undefined, 400, details);
    case '42501':
      return new AdminError(
        'Die Datenbank erlaubt diese Änderung nicht (fehlende Schreibrechte in Supabase).',
        undefined,
        403,
        details
      );
  }

  if (error.message?.includes('fetch failed')) {
    return new AdminError('Die Datenbank ist gerade nicht erreichbar. Bitte versuche es in einem Moment erneut.', undefined, 503, details);
  }

  return new AdminError(`${g.the} ${label} konnte nicht gespeichert werden.`, undefined, 500, details);
}

function notFound(entity: Entity) {
  return new AdminError(
    `${GRAMMAR[entity].this} ${ENTITY_LABEL[entity]} existiert nicht mehr – vielleicht wurde ${GRAMMAR[entity].it} gerade gelöscht. Bitte klicke auf „Aktualisieren“.`,
    undefined,
    404
  );
}

async function assertNoDuplicate(
  entity: Entity,
  scope: { column: string; value: string } | null,
  matches: (row: Record<string, string>) => boolean,
  excludeId: string | undefined,
  message: string,
  field: string,
  columns: string
) {
  let query = supabase.from(TABLE[entity]).select(`id, ${columns}`);
  if (scope) query = query.eq(scope.column, scope.value);
  const { data, error } = await query;
  if (error) throw translateDbError(error, entity, 'create');
  const rows = (data ?? []) as unknown as Record<string, string>[];
  if (rows.some((row) => row.id !== excludeId && matches(row))) {
    throw new AdminError(message, field, 409);
  }
}

// Kategorie erstellen
export async function createCategory(category: CategoryData) {
  const name = required(category.name, 'name', 'Name (DE)');
  await assertNoDuplicate('category', null, (r) => same(r.name, name), undefined, `Eine Kategorie „${name}“ gibt es schon.`, 'name', 'name');
  const id = await uniqueId('category', slugify(name));
  const { error } = await supabase.from('categories').insert({ ...category, name, id });
  if (error) throw translateDbError(error, 'category', 'create');
}

// Kategorie aktualisieren
export async function updateCategory(id: string, data: CategoryData) {
  const name = required(data.name, 'name', 'Name (DE)');
  await assertNoDuplicate('category', null, (r) => same(r.name, name), id, `Eine Kategorie „${name}“ gibt es schon.`, 'name', 'name');
  const { data: rows, error } = await supabase.from('categories').update({ ...data, name }).eq('id', id).select('id');
  if (error) throw translateDbError(error, 'category', 'update');
  if (!rows?.length) throw notFound('category');
}

// Kategorie löschen
export async function deleteCategory(id: string) {
  const { data: rows, error } = await supabase.from('categories').delete().eq('id', id).select('id');
  if (error) throw translateDbError(error, 'category', 'delete');
  if (!rows?.length) throw notFound('category');
}

// Modell erstellen
export async function createModel(model: { category_id: string } & ModelData) {
  const brand = required(model.brand, 'brand', 'Marke');
  const designation = required(model.designation, 'designation', 'Modellbezeichnung');
  if (!model.category_id) throw new AdminError('Es ist keine Kategorie ausgewählt.');
  await assertNoDuplicate(
    'model',
    { column: 'category_id', value: model.category_id },
    (r) => same(r.brand, brand) && same(r.designation, designation),
    undefined,
    `Das Modell „${brand} ${designation}“ gibt es in dieser Kategorie schon.`,
    'designation',
    'brand, designation'
  );
  const id = await uniqueId('model', slugify(`${brand}-${designation}`));
  const { error } = await supabase.from('models').insert({ ...model, brand, designation, id });
  if (error) throw translateDbError(error, 'model', 'create');
}

// Modell aktualisieren
export async function updateModel(id: string, data: ModelData) {
  const brand = required(data.brand, 'brand', 'Marke');
  const designation = required(data.designation, 'designation', 'Modellbezeichnung');
  const { data: current, error: loadError } = await supabase.from('models').select('category_id').eq('id', id).maybeSingle();
  if (loadError) throw translateDbError(loadError, 'model', 'update');
  if (!current) throw notFound('model');
  await assertNoDuplicate(
    'model',
    { column: 'category_id', value: current.category_id },
    (r) => same(r.brand, brand) && same(r.designation, designation),
    id,
    `Das Modell „${brand} ${designation}“ gibt es in dieser Kategorie schon.`,
    'designation',
    'brand, designation'
  );
  const { error } = await supabase.from('models').update({ ...data, brand, designation }).eq('id', id);
  if (error) throw translateDbError(error, 'model', 'update');
}

// Modell löschen
export async function deleteModel(id: string) {
  const { data: rows, error } = await supabase.from('models').delete().eq('id', id).select('id');
  if (error) throw translateDbError(error, 'model', 'delete');
  if (!rows?.length) throw notFound('model');
}

// Teil erstellen
export async function createPart(part: { model_id: string } & PartData) {
  const name = required(part.name, 'name', 'Name (DE)');
  if (!part.model_id) throw new AdminError('Es ist kein Modell ausgewählt.');
  await assertNoDuplicate(
    'part',
    { column: 'model_id', value: part.model_id },
    (r) => same(r.name, name),
    undefined,
    `Ein Teil „${name}“ gibt es bei diesem Modell schon.`,
    'name',
    'name'
  );
  const id = await uniqueId('part', slugify(name));
  const { error } = await supabase.from('parts').insert({ ...part, name, id });
  if (error) throw translateDbError(error, 'part', 'create');
}

// Teil aktualisieren
export async function updatePart(id: string, data: PartData) {
  const name = required(data.name, 'name', 'Name (DE)');
  const { data: current, error: loadError } = await supabase.from('parts').select('model_id').eq('id', id).maybeSingle();
  if (loadError) throw translateDbError(loadError, 'part', 'update');
  if (!current) throw notFound('part');
  await assertNoDuplicate(
    'part',
    { column: 'model_id', value: current.model_id },
    (r) => same(r.name, name),
    id,
    `Ein Teil „${name}“ gibt es bei diesem Modell schon.`,
    'name',
    'name'
  );
  const { error } = await supabase.from('parts').update({ ...data, name }).eq('id', id);
  if (error) throw translateDbError(error, 'part', 'update');
}

// Teil löschen
export async function deletePart(id: string) {
  const { data: rows, error } = await supabase.from('parts').delete().eq('id', id).select('id');
  if (error) throw translateDbError(error, 'part', 'delete');
  if (!rows?.length) throw notFound('part');
}

// Bild hochladen
export async function uploadImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;

  const { error } = await supabase.storage
    .from('parts')
    .upload(filename, file, { contentType: file.type, cacheControl: '31536000' });

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
