// src/actions/preregistration.ts
"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { PreRegistrationSchema } from "@/schemas/preregistration";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export const submitPreRegistration = async (values: z.infer<typeof PreRegistrationSchema>) => {
    const validatedFields = PreRegistrationSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Champs invalides." };
    }

    const data = validatedFields.data;

    // Vérifier si une candidature avec cet email existe déjà
    const existingApplication = await prisma.preRegistration.findUnique({
        where: { email: data.email },
    });

    if (existingApplication) {
        return { error: "Une candidature avec cet email a déjà été soumise." };
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        return { error: "Un compte utilisateur avec cet email existe déjà." };
    }

    try {
        await prisma.preRegistration.create({
            data: { ...data },
        });
        return { success: "Votre candidature a bien été soumise ! Vous recevrez un email si elle est acceptée." };
    } catch (error) {
        console.error(error);
        return { error: "Une erreur est survenue. Veuillez réessayer." };
    }
};


export const approvePreRegistration = async (preRegistrationId: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    const preRegistration = await prisma.preRegistration.findUnique({
        where: { id: preRegistrationId }
    });

    if (!preRegistration) return { error: "Candidature introuvable." };
    if (preRegistration.status !== "PENDING") return { error: "Cette candidature a déjà été traitée." };

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    try {
        // La transaction garantit que toutes les opérations réussissent ou échouent ensemble
        await prisma.$transaction(async (tx) => {
            // 1. Créer l'utilisateur et son profil étudiant
            const newUser = await tx.user.create({
                select: {
                    id: true,
                    studentProfile: {
                        select: {
                            id: true,
                        },
                    },
                },
                data: {
                    name: `${preRegistration.firstName} ${preRegistration.lastName}`,
                    email: preRegistration.email,
                    hashedPassword: hashedPassword,
                    emailVerified: new Date(),
                    role: "STUDENT",
                    studentProfile: {
                        create: {
                            studentIdNumber: `SN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
                        }
                    }
                }
            });

            // 2. Créer l'inscription à la formation
            const academicYear = await tx.academicYear.findFirst({ orderBy: { startDate: 'desc' } });
            if (!academicYear) throw new Error("Année académique non trouvée.");

            await tx.enrollment.create({
                data: {
                    studentId: newUser.studentProfile!.id, // Le ! est sûr grâce à la transaction
                    formationId: preRegistration.desiredProgramId,
                    academicYearId: academicYear.id,
                }
            });

            // 3. Mettre à jour le statut de la candidature
            await tx.preRegistration.update({
                where: { id: preRegistrationId },
                data: { status: "APPROVED" }
            });
        });

        // 4. Envoyer l'email de bienvenue (en dehors de la transaction)
        await sendWelcomeEmail(preRegistration.email, `${preRegistration.firstName} ${preRegistration.lastName}`, temporaryPassword);

        revalidatePath("/admin/pre-registrations");
        revalidatePath(`/admin/pre-registrations/${preRegistrationId}`);
        return { success: "Étudiant inscrit avec succès ! Un email de bienvenue a été envoyé." };

    } catch (error) {
        console.error("ERREUR D'APPROBATION:", error);
        return { error: "Une erreur est survenue lors de l'inscription de l'étudiant." };
    }
}

export const rejectPreRegistration = async (preRegistrationId: string) => {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

    try {
        await prisma.preRegistration.update({
            where: { id: preRegistrationId },
            data: { status: "REJECTED" },
        });

        revalidatePath("/admin/pre-registrations");
        return { success: "Candidature rejetée." };
    } catch {
        return { error: "Une erreur est survenue." };
    }
};