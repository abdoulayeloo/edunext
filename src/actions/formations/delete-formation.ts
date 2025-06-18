"use server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

/**
 * Supprime une formation.
 * Rôle requis : ADMIN
 */
export const deleteFormation = async (id: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    if (!id) return { error: "ID manquant pour la suppression." };

    try {
        // Vérifie si des étudiants sont inscrits
        // avant de supprimer la formation
        const studentsEnrolled = await prisma.enrollment.count({ where: { formationId: id } });
        if (studentsEnrolled > 0) {
            return { error: "La formation est encore liée à des étudiants. Assurez-vous d'avoir supprimé leur inscription." };
        }
        await prisma.formation.delete({ where: { id } });

        revalidatePath("/admin/formations");
        return { success: "Formation supprimée avec succès !" };
    } catch {
        return { error: "Une erreur est survenue. Assurez-vous qu'aucun semestre ou étudiant n'est lié à cette formation." };
    }
};