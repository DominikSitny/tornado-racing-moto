import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, checkAdminPassword } from '@/lib/supabase-data';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;

    // Passwort prüfen
    const isValid = await checkAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });
    }

    const publicUrl = await uploadImage(file);
    return NextResponse.json({ path: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Fehler beim Upload' }, { status: 500 });
  }
}
