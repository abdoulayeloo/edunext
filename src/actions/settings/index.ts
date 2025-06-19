// src/actions/settings.ts
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { SettingsSchema } from "@/schemas/settings";
import {  getUserById } from "@/data/user";

export const updateSettings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé" };

  const dbUser = await getUserById(session.user.id!);
  if (!dbUser) return { error: "Utilisateur introuvable." };

  // Si l'utilisateur s'est connecté via OAuth (ex: GitHub), il n'a pas de mot de passe à changer.
  if (!dbUser.hashedPassword) {
    // On ne met à jour que le nom dans ce cas
    const validatedName = SettingsSchema.safeParse(values);
    if (!validatedName.success) return { error: "Nom invalide." };

    await prisma.user.update({
        where: { id: dbUser.id },
        data: { name: validatedName.data.name },
    });

    return { success: "Nom mis à jour avec succès !" };
  }

  // Pour les utilisateurs avec mot de passe
  const validatedFields = SettingsSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Champs invalides." };

  // eslint-disable-next-line prefer-const
  let { name, password, newPassword } = validatedFields.data;

  // Si l'utilisateur veut changer son mot de passe
  if (password && newPassword) {
    const passwordMatch = await bcrypt.compare(password, dbUser.hashedPassword);
    if (!passwordMatch) return { error: "L'ancien mot de passe est incorrect." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
        where: { id: dbUser.id },
        data: { name, hashedPassword },
    });
  } else {
    // Si seulement le nom est changé
    await prisma.user.update({
        where: { id: dbUser.id },
        data: { name },
    });
  }

  return { success: "Paramètres mis à jour avec succès !" };
};