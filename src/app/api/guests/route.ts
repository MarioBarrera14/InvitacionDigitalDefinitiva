import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. OBTENER INVITADOS
export async function GET() {
  try {
    const invitados = await prisma.guest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(invitados);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener invitados" }, { status: 500 });
  }
}

// 2. CREAR INVITADO (Con validación de duplicados)
export async function POST(req: Request) {
  try {
    const { apellido, cupos, codigo } = await req.json();

    // Validar si la familia/apellido ya existe
    const familiaExiste = await prisma.guest.findFirst({
      where: { apellido: { equals: apellido, mode: 'insensitive' } }
    });

    if (familiaExiste) {
      return NextResponse.json({ error: "Esta familia ya está registrada" }, { status: 400 });
    }

    // Validar si el código ya existe
    const codigoExiste = await prisma.guest.findUnique({
      where: { codigo: codigo }
    });

    if (codigoExiste) {
      return NextResponse.json({ error: "El código generado ya existe, intenta de nuevo" }, { status: 400 });
    }

    const nuevoInvitado = await prisma.guest.create({
      data: { 
        apellido, 
        cupos, 
        codigo,
        status: "PENDING" 
      },
    });
    return NextResponse.json(nuevoInvitado, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear invitado" }, { status: 500 });
  }
}

// 3. ACTUALIZAR ASISTENCIA (PATCH) - Corregido para evitar nombres duplicados
export async function PATCH(req: Request) {
  try {
    const { code, status, dietary, name } = await req.json();

    const invitado = await prisma.guest.findUnique({
      where: { codigo: code }
    });

    if (!invitado) {
      return NextResponse.json({ error: "Código no válido" }, { status: 404 });
    }

    // LÓGICA ANTIDUPLICADO DE NOMBRE:
    // Si el nombre escrito es igual al apellido, no lo concatenamos.
    const nombreFinal = 
      invitado.apellido.toLowerCase().trim() === name.toLowerCase().trim()
        ? invitado.apellido
        : `${invitado.apellido} (${name})`;

    const actualizado = await prisma.guest.update({
      where: { codigo: code },
      data: {
        status: status, 
        dietary: dietary, 
        apellido: nombreFinal, 
      }
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("Error en PATCH:", error);
    return NextResponse.json({ error: "Error al actualizar asistencia" }, { status: 500 });
  }
}

// 4. ELIMINAR
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.guest.delete({ where: { id } });
    return NextResponse.json({ message: "Eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}