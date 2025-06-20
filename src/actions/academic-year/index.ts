// src/actions/academic-year.ts
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { AcademicYearSchema } from "@/schemas/academic-year";
import { createAuditLog } from "@/lib/audit-log";

// Formatage de l'année, ex: 2024-2025
const formatYearString = (start: Date, end: Date) => `${start.getFullYear()}-${end.getFullYear()}`;

export const createAcademicYear = async (values: z.infer<typeof AcademicYearSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Non autorisé !" };

    const validatedFields = AcademicYearSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    const { startDate, endDate } = validatedFields.data;
    const year = formatYearString(startDate, endDate);

    try {
        const academicYear = await prisma.academicYear.create({
            data: { year, startDate, endDate }
        });

        await createAuditLog({
            action: "CREATE",
            entityType: "ACADEMIC_YEAR",
            entityId: academicYear.id,
            entityTitle: academicYear.year,
        });

        revalidatePath("/admin/academic-years");
        return { success: "Année académique créée !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};

/**
 * Met à jour une année académique existante.
 * Rôle requis : ADMIN
 */
export const updateAcademicYear = async (values: z.infer<typeof AcademicYearSchema>) => {
  // 1. Vérifier la session et le rôle de l'utilisateur
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Accès non autorisé !" };
  }

  // 2. Valider les champs du formulaire
  const validatedFields = AcademicYearSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { id, startDate, endDate } = validatedFields.data;

  // 3. S'assurer que l'ID est bien présent pour une mise à jour
  if (!id) {
    return { error: "ID manquant pour la mise à jour." };
  }

  const year = formatYearString(startDate, endDate);

  try {
    // 4. Mettre à jour l'année académique dans la base de données
    const updatedAcademicYear = await prisma.academicYear.update({
      where: { id },
      data: {
        year,
        startDate,
        endDate,
      },
    });

    // 5. Journaliser l'action
    await createAuditLog({
      action: "UPDATE",
      entityType: "ACADEMIC_YEAR",
      entityId: updatedAcademicYear.id,
      entityTitle: updatedAcademicYear.year,
    });

    // 6. Invalider le cache pour rafraîchir l'interface
    revalidatePath("/admin/academic-years");
    return { success: "Année académique mise à jour avec succès !" };
  } catch (error) {
    console.error("Update Academic Year Error:", error);
    return { error: "Une erreur est survenue lors de la mise à jour." };
  }
};