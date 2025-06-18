"use server"
import { auth } from "@/auth";
import { UESchema } from "@/schemas"
import { z } from "zod"
import { prisma } from '../../lib/db';
import { revalidatePath } from "next/cache";



/**
 * Crée une nouvelle Unité d'Enseignement (UE).
 * Rôle requis : ADMIN
 * 
 * @param values Un objet contenant les informations de l'UE à créer, 
 * incluant le nom, les crédits totaux et l'ID du semestre.
 * @returns Un objet avec un champ "success" si la création a réussi, 
 * ou un champ "error" en cas d'erreur ou d'accès non autorisé.
 */

export const createUE = async (values: z.infer<typeof UESchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
    const validatedFields = UESchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };
    const { name, totalCredits, semesterId } = validatedFields.data;
    // Note: On a besoin de l'ID de la formation pour revalider le chemin
    const semester = await prisma.semester.findUnique({ where: { id: semesterId } });
    if (!semester) return { error: "Semestre non trouvé !" };
    await prisma.uE.create({ data: { name, totalCredits, semesterId } });
    revalidatePath(`/admin/formations/${semester.formationId}`);
    return { success: "UE créée avec succès !" };
};

    /**
     * Met à jour une UE existante.
     * Rôle requis : ADMIN
     * @param values Les valeurs à mettre à jour, incluant l'ID, le nom et les crédits.
     * @returns Un objet avec un champ "success" si la mise à jour a réussi, ou un champ "error" sinon.
     */
export const updateUE = async (values: z.infer<typeof UESchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
    
    const { id, name, totalCredits } = values;
    if (!id) return { error: "ID manquant." };
    
    const ue = await prisma.uE.findUnique({ where: { id }, include: { semester: true }});
    if (!ue) return { error: "UE introuvable."};

    await prisma.uE.update({ where: { id }, data: { name, totalCredits } });
    revalidatePath(`/admin/formations/${ue.semester.formationId}`);
    return { success: "UE mise à jour !" };
}


    /**
     * Supprime une Unité d'Enseignement (UE) existante.
     * Rôle requis : ADMIN
     * @param id ID de l'UE à supprimer
     * @returns Un objet avec un champ "success" si la suppression a réussi, ou un champ "error" si une erreur est survenue.
     */
export const deleteUE = async (id: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
    
    const ue = await prisma.uE.findUnique({ where: { id } });
    if (!ue) return { error: "UE introuvable."};
    
    await prisma.uE.delete({ where: { id } });
    revalidatePath(`/admin/formations/${ue.id}`);
    return { success: "UE supprimée !" };
}


