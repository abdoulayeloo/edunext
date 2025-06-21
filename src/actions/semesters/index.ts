// --- ACTIONS POUR LES SEMESTRES ---
"use server";
import { auth } from "@/auth";
import { SemesterSchema } from "@/schemas/semester";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from '@/lib/prisma';

/**
 * Crée un nouveau semestre pour une formation.
 * Rôle requis : ADMIN
 */
export const createSemester = async (values: z.infer<typeof SemesterSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = SemesterSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    const { name, formationId } = validatedFields.data;

    try {
        await prisma.semester.create({ data: { name, formationId } });
        revalidatePath(`/admin/formations/${formationId}`);
        return { success: "Semestre créé avec succès !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};

/**
 * Met à jour un semestre existant.
 * Rôle requis : ADMIN
 */
export const updateSemester = async (values: z.infer<typeof SemesterSchema>) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };
  
  const { id, name, formationId } = values;
  if (!id) return { error: "ID manquant." };

  await prisma.semester.update({ where: { id }, data: { name } });
  revalidatePath(`/admin/formations/${formationId}`);
  return { success: "Semestre mis à jour !" };
};

/**
 * Supprime un semestre existant.
 * Rôle requis : ADMIN
 */
export const deleteSemester = async (id: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const semester = await prisma.semester.findUnique({ where: { id } });
    if (!semester) return { error: "Semestre introuvable."};
    
    // TODO: Ajouter une vérification pour empêcher la suppression si des UE sont liées
    await prisma.semester.delete({ where: { id } });
    revalidatePath(`/admin/formations/${semester.formationId}`);
    return { success: "Semestre supprimé !" };
}