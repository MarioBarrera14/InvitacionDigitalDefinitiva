// app/api/asistencia/route.ts
import { NextResponse } from 'next/server';

// Esto es temporal. Al reiniciar el servidor se borra. 
// Deberías usar Prisma, Supabase o Mongo aquí.
let invitados: any[] = []; 

export async function POST(request: Request) {
  const data = await request.json();
  
  const nuevoInvitado = {
    id: Date.now().toString(),
    ...data,
    status: data.asiste === "¡SÍ, OBVIO! 🤩" ? 'CONFIRMED' : 'CANCELLED',
    updatedAt: new Date().toISOString(),
  };

  invitados.push(nuevoInvitado);
  return NextResponse.json(nuevoInvitado, { status: 201 });
}

export async function GET() {
  return NextResponse.json(invitados);
}