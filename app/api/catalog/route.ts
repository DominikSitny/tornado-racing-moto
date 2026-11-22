import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCategoriesFromDb,
  getAllCategoriesRaw,
  checkAdminPassword,
  createCategory,
  updateCategory,
  deleteCategory,
  createModel,
  updateModel,
  deleteModel,
  createPart,
  updatePart,
  deletePart,
  AdminError,
} from '@/lib/supabase-data';
import { Locale } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') || 'de') as Locale;
    const raw = searchParams.get('raw') === 'true';

    // Für Admin: Alle Sprachfelder laden
    if (raw) {
      const categories = await getAllCategoriesRaw();
      return NextResponse.json({ categories });
    }

    // Für Frontend: Lokalisierte Daten
    const categories = await getAllCategoriesFromDb(locale);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, data } = body;

    // Passwort prüfen
    const isValid = await checkAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }

    // Nur Passwort testen
    if (action === 'test') {
      return NextResponse.json({ success: true });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Es wurden keine Daten übermittelt.' }, { status: 400 });
    }

    // CRUD Operationen – IDs werden auf dem Server vergeben, nicht vom Browser
    const { id, ...fields } = data;
    switch (action) {
      case 'createCategory':
        await createCategory(fields);
        break;
      case 'updateCategory':
        await updateCategory(id, fields);
        break;
      case 'deleteCategory':
        await deleteCategory(id);
        break;
      case 'createModel':
        await createModel(fields);
        break;
      case 'updateModel':
        await updateModel(id, fields);
        break;
      case 'deleteModel':
        await deleteModel(id);
        break;
      case 'createPart':
        await createPart(fields);
        break;
      case 'updatePart':
        await updatePart(id, fields);
        break;
      case 'deletePart':
        await deletePart(id);
        break;
      default:
        return NextResponse.json({ error: `Unbekannte Aktion „${action}“.` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminError) {
      if (error.status >= 500) console.error('Admin error:', error.message, error.details);
      return NextResponse.json(
        { error: error.message, field: error.field, details: error.details },
        { status: error.status }
      );
    }
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Beim Speichern ist ein unerwarteter Fehler aufgetreten.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
