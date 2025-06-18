// src/actions/user.ts
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * Crée un nouvel utilisateur.
 * Rôle requis : ADMIN
 */
/**
 * Crée un nouvel utilisateur.
 * Rôle requis : ADMIN
 */
export const createUser = async (values: z.infer<typeof RegisterSchema>) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Champs invalides." };

  const { email, password, name, role } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "Cet email est déjà utilisé !" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
      emailVerified: new Date(), // On considère l'email comme vérifié si créé par un admin
      ...(role === "ADMIN" && { adminProfile: { create: {} } }),
      ...(role === "PROFESSOR" && { professorProfile: { create: {} } }),
      ...(role === "STUDENT" && { studentProfile: { create: { studentIdNumber: `SN-${Date.now()}` } } }),
    },
  });

  revalidatePath("/admin/users");

  // Move the verification token generation inside the createUser function
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );
  return { success: "Email de verification envoyé !" };
};






/**
 * Supprime un utilisateur.
 * Rôle requis : ADMIN
 */
export const deleteUser = async (id: string) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Accès non autorisé !" };

  if (!id) return { error: "ID manquant." };

  // Empêcher un admin de se supprimer lui-même
  if (session.user.id === id) return { error: "Vous ne pouvez pas supprimer votre propre compte !" };

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: "Utilisateur supprimé." };
  } catch {
    return { error: "Une erreur est survenue." };
  }
}