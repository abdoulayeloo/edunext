// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    // pages: { ... } // Vous pouvez définir des pages personnalisées ici si besoin

    // Événements pour gérer des logiques spécifiques (ex: lier un compte OAuth)
    //   events: {
    //     async linkAccount({ user }) {
    //       await prisma.user.update({
    //         where: { id: user.id },
    //         data: { emailVerified: new Date() },
    //       });
    //     },
    //   },

    // Les callbacks sont essentiels pour contrôler le flux de la session
    callbacks: {
        // Le callback `signIn` peut être utilisé pour des vérifications supplémentaires
        // avant que la connexion ne soit finalisée.
        async signIn({ user, account }) {
            // Autoriser la connexion OAuth sans vérification d'email
            if (account?.provider !== "credentials") return true;

            // Pour les credentials, empêcher la connexion si l'email n'est pas vérifié
            const existingUser = await getUserById(user.id!);
            if (!existingUser?.emailVerified) return false;

            // TODO: Ajouter la logique pour la 2FA (Two-Factor Authentication) si nécessaire

            return true;
        },
        // Le callback `session` transmet les données de l'utilisateur à la session côté client
        // Ce callback est appelé pour créer l'objet session
      async session({ session, token }) {
        // On ajoute le rôle depuis le token vers l'objet session.user
        if (session.user && token.role) {
          session.user.role = token.role as "ADMIN" | "PROFESSOR" | "STUDENT";
        }
        return session;
      },

        // Le callback `jwt` est appelé à la création/mise à jour du token JWT
        // C'est ici qu'on ajoute les informations personnalisées au token
        async jwt({ token, user }) {
            // Si `user` est présent (uniquement à la connexion), on ajoute son rôle au token
            if (user && user.id) {
                const dbUser = await getUserById(user.id);
                if (dbUser) {
                    token.role = dbUser.role;
                }
            }
            return token;
        },
    },

    // L'adapter Prisma connecte NextAuth à votre base de données
    adapter: PrismaAdapter(prisma),
    // La stratégie de session JWT est nécessaire pour le middleware et les callbacks
    session: { strategy: "jwt" },
    // On importe le reste de la configuration (nos providers) depuis auth.config.ts
    ...authConfig,
});