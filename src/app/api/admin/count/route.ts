"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEventConfig() {
  try {
    // Buscamos el registro con ID 1 (el que definiste en tu esquema)
    const config = await prisma.eventConfig.findUnique({
      where: { id: 1 },
    });
    return config;
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    return null;
  }
}

export async function updateEventConfig(data: any) {
  try {
    await prisma.eventConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    revalidatePath("/"); // Actualiza la caché de la página
    return { success: true };
  } catch (error) {
    console.error("Error al guardar:", error);
    return { success: false };
  }
}