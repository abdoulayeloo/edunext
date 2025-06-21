// Dans src/actions/academic.ts
// ... (imports)
import { createAuditLog } from "@/lib/audit-log"; // Importez la nouvelle fonction
import { FormationSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";

// ...

export const createFormation = async (values: z.infer<typeof FormationSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = FormationSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    const { name, diplomaLevel } = validatedFields.data;

    try {
        // ... (logique de vérification de l'existence)

        const formation = await prisma.formation.create({ // On récupère la formation créée
            data: {
                name,
                diplomaLevel,
            },
        });

        // --- JOURNALISATION DE L'ACTION ---
        await createAuditLog({
            action: "CREATE",
            entityType: "FORMATION",
            entityId: formation.id,
            entityTitle: formation.name,
        });
        // --- FIN DE LA JOURNALISATION ---

        revalidatePath("/admin/formations");
        return { success: "Formation créée avec succès !" };
    } catch {
        return { error: "Une erreur est survenue lors de la création de la formation." };
    }
};