// src/actions/admin.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Récupère tous les utilisateurs de la base de données.
 * Nécessite le rôle ADMIN.
 */
export const getAllUsers = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Accès non autorisé !" };
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return { users };
  } catch {
    return { error: "Impossible de récupérer les utilisateurs." };
  }
};