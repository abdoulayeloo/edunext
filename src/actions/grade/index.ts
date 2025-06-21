// src/actions/grade.ts
"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GradeSchema = z.object({
  value: z.coerce.number().min(0, "La note doit être positive.").max(20, "La note ne peut excéder 20."),
  studentId: z.string(),
  evaluationId: z.string(),
});

export const assignOrUpdateGrade = async (values: z.infer<typeof GradeSchema>) => {
  const session = await auth();
  if (session?.user?.role !== "PROFESSOR") {
    return { error: "Accès non autorisé !" };
  }

  const validatedFields = GradeSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Données invalides." };
  }

  const { studentId, evaluationId, value } = validatedFields.data;

  try {
    // Sécurité : Vérifier que le professeur a le droit de noter cette évaluation
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { ec: { include: { professor: true } } },
    });
    if (evaluation?.ec?.professor?.userId !== session.user.id) {
      return { error: "Vous n'êtes pas autorisé à noter pour ce cours." };
    }

    // Upsert: met à jour la note si elle existe, sinon la crée.
    await prisma.grade.upsert({
      where: {
        studentId_evaluationId: {
          studentId,
          evaluationId,
        },
      },
      update: { value },
      create: {
        studentId,
        evaluationId,
        value,
      },
    });

    revalidatePath("/enseignant");
    return { success: "Note enregistrée !" };
  } catch {
    return { error: "Une erreur est survenue." };
  }
};