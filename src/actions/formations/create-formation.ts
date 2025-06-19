// src/data/formation.ts
'use server';
import { auth } from "@/auth";
import { FormationSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/db';
import { z } from "zod";

// --- ACTIONS POUR LES FORMATIONS ---

/**
 * Crée une nouvelle formation.
 * Rôle requis : ADMIN
 */
export const createFormation = async (values: z.infer<typeof FormationSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = FormationSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    const { name, diplomaLevel } = validatedFields.data;

    try {
        const existingFormation = await prisma.formation.findFirst({ where: { name } });
        if (existingFormation) return { error: "Une formation avec ce nom existe déjà !" };

        await prisma.formation.create({ data: { name, diplomaLevel } });

        revalidatePath("/admin/formations");
        return { success: "Formation créée avec succès !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};