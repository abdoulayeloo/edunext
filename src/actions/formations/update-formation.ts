"use server";
import { auth } from "@/auth";
import { FormationSchema } from "@/schemas";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Met à jour une formation existante.
 * Rôle requis : ADMIN
 */
export const updateFormation = async (values: z.infer<typeof FormationSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = FormationSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    const { id, name, diplomaLevel } = validatedFields.data;
    if (!id) return { error: "ID manquant pour la mise à jour." };

    try {
        await prisma.formation.update({
            where: { id },
            data: { name, diplomaLevel},
        });

        revalidatePath("/admin/formations");
        return { success: "Formation mise à jour avec succès !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};