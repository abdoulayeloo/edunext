// src/actions/new-verification.ts
"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  // 1. Récupérer le token de la BDD
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Le token n'existe pas !" };
  }

  // 2. Vérifier si le token a expiré
  const hasExpired = existingToken.expires !== null && new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Le token a expiré !" };
  }

  // 3. Récupérer l'utilisateur associé à l'email du token
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "L'email associé à ce token n'existe pas." };
  }

  // 4. Mettre à jour l'utilisateur pour le marquer comme vérifié
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      // Mettre à jour l'email de l'utilisateur au cas où il aurait été modifié
      email: existingToken.email,
    },
  });

//   // 5. Supprimer le token de vérification maintenant qu'il a été utilisé
//   await prisma.verificationToken.delete({
//     where: { id: existingToken.id },
//   });

  return { success: "Votre email a été vérifié avec succès !" };
};