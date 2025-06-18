// src/actions/login.ts
"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Champs invalides !" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/", // Le middleware interceptera et redirigera correctement
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou mot de passe incorrect." };
                default:
                    return { error: error.message };
            }
        }
        throw error; // Renvoyer les autres erreurs
    }
    return { success: "Connexion réussie !" };
};