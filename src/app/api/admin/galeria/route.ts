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
    console.error("Error al obtener config:", error);
    return null;
  }
}

export async function updateEventDetails(formData: any) {
  try {
    // Usamos upsert: si el ID 1 no existe lo crea, si existe lo actualiza
    await prisma.eventConfig.upsert({
      where: { id: 1 },
      update: {
        ...formData // Aquí entran heroImage, videoUrl, carruselImages, etc.
      },
      create: {
        id: 1,
        ...formData
      },
    });

    revalidatePath("/"); // Refresca la invitación para los invitados
    return { success: true };
  } catch (error) {
    console.error("Error en updateEventDetails:", error);
    return { success: false, error: "No se pudo conectar con la base de datos" };
  }
}