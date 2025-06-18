// src/lib/tokens.ts
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/actions/auth/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  // Le token expirera dans 1 heure
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Vérifier si un token existe déjà pour cet email
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    // Supprimer l'ancien token pour en générer un nouveau
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Créer le nouveau token dans la base de données
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 heure

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};