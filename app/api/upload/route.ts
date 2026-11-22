import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, checkAdminPassword } from '@/lib/supabase-data';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Nur JPG, PNG oder WebP erlaubt' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Datei ist größer als 10 MB' }, { status: 400 });
    }

    const publicUrl = await uploadImage(file);
    return NextResponse.json({ path: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Fehler beim Upload' }, { status: 500 });
  }
}
