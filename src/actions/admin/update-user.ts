"use server";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

/**
 * Met à jour le rôle d'un utilisateur spécifique.
 * Nécessite le rôle ADMIN.
 */
export const updateUserRole = async (userId: string, newRole: Role) => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return { error: "Accès non autorisé !" };
    }

    if (!userId || !newRole) {
        return { error: "Informations manquantes." };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        // Invalide le cache pour que la page se mette à jour avec les nouvelles données
        revalidatePath("/admin/users");
        return { success: "Le rôle de l'utilisateur a été mis à jour." };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};