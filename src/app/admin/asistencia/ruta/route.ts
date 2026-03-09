import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta al archivo donde guardaremos los datos (puedes usar una DB después)
const filePath = path.join(process.cwd(), 'data', 'attendance.json');

export async function GET() {
  if (!fs.existsSync(filePath)) return NextResponse.json([]);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return NextResponse.json(JSON.parse(fileContent));
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Leemos lo que ya existe
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // Agregamos el nuevo invitado
  const newGuest = {
    id: Date.now().toString(),
    ...body,
    updatedAt: new Date().toISOString()
  };

  data.push(newGuest);
  
  // Guardamos
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  return NextResponse.json(newGuest);
}