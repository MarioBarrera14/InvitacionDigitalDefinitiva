"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEventConfig() {
  try {
    const config = await prisma.eventConfig.findUnique({
      where: { id: 1 },
    });
    return config;
  } catch (error) {
    console.error("Error en getEventConfig:", error);
    return null;
  }
}

export async function updateEventDetails(formData: any) {
  try {
    // Limpiamos el objeto para asegurar que el ID sea un número y no se duplique
    const { id, ...dataWithoutId } = formData;

    await prisma.eventConfig.upsert({
      where: { id: 1 },
      update: dataWithoutId,
      create: { 
        id: 1, 
        ...dataWithoutId 
      },
    });

    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    // Esto te dirá exactamente qué campo está dando error en la terminal
    console.error("Error detallado en Prisma:", error);
    return { success: false, error: String(error) };
  }
}