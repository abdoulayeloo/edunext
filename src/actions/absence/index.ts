// src/actions/absence.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const toggleAbsence = async (
    studentId: string, 
    ecId: string, 
    date: Date
) => {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== "PROFESSOR") return { error: "Accès non autorisé !" };

    const professorProfile = await prisma.professor.findUnique({ where: { userId: user.id }});
    if (!professorProfile) return { error: "Profil professeur introuvable." };

    try {
        const existingAbsence = await prisma.absence.findUnique({
            where: { studentId_ecId_date: { studentId, ecId, date }}
        });

        if (existingAbsence) {
            // Si l'absence existe, on la supprime (l'étudiant est finalement présent)
            await prisma.absence.delete({ where: { id: existingAbsence.id }});
            revalidatePath("/enseignant");
            return { success: "Absence retirée." };
        } else {
            // Sinon, on la crée
            await prisma.absence.create({
                data: {
                    studentId,
                    ecId,
                    date,
                    professorId: professorProfile.id,
                }
            });
            revalidatePath("/enseignant");
            return { success: "Absence enregistrée." };
        }
    } catch {
        return { error: "Une erreur est survenue." };
    }
}