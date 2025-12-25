import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCategoriesFromDb,
  checkAdminPassword,
  createCategory,
  updateCategory,
  deleteCategory,
  createModel,
  updateModel,
  deleteModel,
  createPart,
  updatePart,
  deletePart
} from '@/lib/supabase-data';

export async function GET() {
  try {
    const categories = await getAllCategoriesFromDb();
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

    // CRUD Operationen
    switch (action) {
      case 'createCategory':
        await createCategory(data);
        break;
      case 'updateCategory':
        await updateCategory(data.id, data);
        break;
      case 'deleteCategory':
        await deleteCategory(data.id);
        break;
      case 'createModel':
        await createModel(data);
        break;
      case 'updateModel':
        await updateModel(data.id, data);
        break;
      case 'deleteModel':
        await deleteModel(data.id);
        break;
      case 'createPart':
        await createPart(data);
        break;
      case 'updatePart':
        await updatePart(data.id, data);
        break;
      case 'deletePart':
        await deletePart(data.id);
        break;
      default:
        return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 });
  }
}
