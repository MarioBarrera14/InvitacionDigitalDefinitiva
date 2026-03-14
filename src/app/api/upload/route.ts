import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No hay archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determinamos si es video o imagen para la carpeta
    const folder = file.type.includes('video') ? 'boda/videos' : 'boda/fotos';

    const result = await uploadToCloudinary(
      buffer,
      file.name,
      folder,
      file.type // Pasamos el tipo de archivo
    );

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error('Error en API Upload:', error);
    return NextResponse.json({ error: 'Error al procesar subida' }, { status: 500 });
  }
}