// src/actions/new-password.ts
"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/actions/auth/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";

const NewPasswordSchema = z.object({ password: z.string().min(6) });

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: "Token manquant !" };
  
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Mot de passe invalide." };
  
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Token invalide !" };
  
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Le token a expiré !" };
  
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Aucun utilisateur trouvé." };
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { hashedPassword },
  });
  
  await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
  
  return { success: "Mot de passe mis à jour avec succès !" };
};