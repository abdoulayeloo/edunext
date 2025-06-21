"use server";
import { auth } from "@/auth";
import { ECSchema } from "@/schemas";
import { z } from "zod";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from "next/cache";


/**
 * Crée une nouvelle EC.
 * Rôle requis : ADMIN
 * 
 * @param values Un objet contenant les informations de l'EC à créer, 
 * incluant le nom, les crédits et l'ID de l'UE.
 * @returns Un objet avec un champ "success" si la création a réussi, 
 * ou un champ "error" en cas d'erreur ou d'accès non autorisé.
 */
export const createEC = async (values: z.infer<typeof ECSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
    const validatedFields = ECSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };
    const { name, credits, ueId } = validatedFields.data;
    const ue = await prisma.uE.findUnique({ where: { id: ueId }, include: { semester: true } });
    if (!ue) return { error: "UE non trouvée !" };
    await prisma.eC.create({ data: { name, credits, ueId } });
    revalidatePath(`/admin/formations/${ue.semester.formationId}`);
    return { success: "EC créé avec succès !" };
};


/**
 * Met à jour un Élément Constitutif (EC) existant.
 * Rôle requis : ADMIN
 * 
 * @param values Un objet contenant les informations de l'EC à mettre à jour, 
 * incluant l'ID, le nom, les crédits et éventuellement l'ID du professeur.
 * @returns Un objet avec un champ "success" si la mise à jour a réussi, 
 * ou un champ "error" en cas d'erreur ou d'accès non autorisé.
 */
export const updateEC = async (values: z.infer<typeof ECSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const { id, name, credits, professorId } = values;
    if (!id) return { error: "ID manquant." };

    const ec = await prisma.eC.findUnique({ where: { id }, include: { ue: { include: { semester: true }}}});
    if (!ec) return { error: "EC introuvable."};

    await prisma.eC.update({ where: { id }, data: { name, credits, professorId } });
    revalidatePath(`/admin/formations/${ec.ue.semester.formationId}`);
    return { success: "EC mis à jour !" };
}

/**
 * Supprime un Élément Constitutif (EC) existant.
 * Rôle requis : ADMIN
 * 
 * @param id ID de l'EC à supprimer
 * @returns Un objet avec un champ "success" si la suppression a réussi, 
 * ou un champ "error" en cas d'erreur ou d'accès non autorisé.
 */

export const deleteEC = async (id: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
    
    const ec = await prisma.eC.findUnique({ where: { id } });
    if (!ec) return { error: "EC introuvable."};
    
    await prisma.eC.delete({ where: { id } });
    revalidatePath(`/admin/formations/ue/${ec.id}`);
    return { success: "EC supprimée !" };
}