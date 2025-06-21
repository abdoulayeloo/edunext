// src/actions/announcement.ts
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const AnnouncementSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
    content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères."),
});

export const createAnnouncement = async (values: z.infer<typeof AnnouncementSchema>) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const validatedFields = AnnouncementSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Champs invalides." };

    try {
        await prisma.announcement.create({
            data: {
                title: validatedFields.data.title,
                content: validatedFields.data.content,
                authorId: session.user.id!,
            }
        });

        revalidatePath("/admin/announcements");
        // Revalider les dashboards où les annonces s'affichent
        revalidatePath("/etudiant"); 
        revalidatePath("/enseignant");

        return { success: "Annonce publiée avec succès !" };
    } catch {
        return { error: "Une erreur est survenue." };
    }
}

export const deleteAnnouncement = async (id: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    try {
        await prisma.announcement.delete({ where: { id }});
        revalidatePath("/admin/announcements");
        return { success: "Annonce supprimée." };
    } catch {
        return { error: "Une erreur est survenue." };
    }
}