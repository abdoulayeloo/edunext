// src/actions/enrollment.ts
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
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