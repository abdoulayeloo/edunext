// src/actions/logout.ts
"use server";

import { signOut } from "@/auth";

export const logout = async () => {
    // Ici, vous pourriez ajouter de la logique avant la déconnexion si nécessaire
    // (ex: logger l'événement, etc.)
    await signOut();
};