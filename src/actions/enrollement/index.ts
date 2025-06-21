// src/actions/enrollment.ts
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const EnrollmentSchema = z.object({
    studentId: z.string().min(1),
    formationId: z.string().min(1),
    academicYearId: z.string().min(1),
});

/**
 * Inscrit un étudiant à une formation pour une année académique.
 * Rôle requis : ADMIN
 */
export const enrollStudent = async (values: z.infer<typeof EnrollmentSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = EnrollmentSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Données d'inscription invalides." };

    const { studentId, formationId, academicYearId } = validatedFields.data;

    try {
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: { studentId, formationId, academicYearId },
        });

        if (existingEnrollment) return { error: "Cet étudiant est déjà inscrit à cette formation pour cette année." };

        await prisma.enrollment.create({
            data: { studentId, formationId, academicYearId },
        });

        revalidatePath(`/admin/formations/${formationId}/inscriptions`);
        return { success: "Étudiant inscrit avec succès !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};

export const enrollStudentInFormation = async (studentId: string, formationId: string) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

  try {
    const academicYear = await prisma.academicYear.findFirst({ orderBy: { startDate: 'desc' }});
    if (!academicYear) return { error: "Aucune année académique active trouvée." };
    
    // Vérifier si l'inscription existe déjà
    const existing = await prisma.enrollment.findFirst({
        where: { studentId, formationId, academicYearId: academicYear.id }
    });
    if (existing) return { error: "Cet étudiant est déjà inscrit." };

    await prisma.enrollment.create({
      data: {
        studentId,
        formationId,
        academicYearId: academicYear.id,
      },
    });

    revalidatePath(`/admin/formations/${formationId}`);
    return { success: "Étudiant inscrit avec succès !" };
  } catch {
    return { error: "Une erreur est survenue." };
  }
};

export const unenrollStudent = async (enrollmentId: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    try {
        const enrollment = await prisma.enrollment.delete({ where: { id: enrollmentId }});
        revalidatePath(`/admin/formations/${enrollment.formationId}`);
        return { success: "Étudiant désinscrit." };
    } catch {
        return { error: "Une erreur est survenue." };
    }
}