// src/data/professor.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const saveAppreciation = async (enrollmentId: string, appreciation: string) => {
    const session = await auth();
    if (session?.user?.role !== "PROFESSOR") {
        return { error: "Accès non autorisé !" };
    }

    try {
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { appreciation },
        });

        revalidatePath("/enseignant");
        return { success: "Appréciation enregistrée." };
    } catch {
        return { error: "Une erreur est survenue." };
    }
}