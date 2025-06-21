// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { Role } from "@prisma/client";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/connexion",
    error: "/auth/error", // Page pour afficher les erreurs d'authentification
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
        if (account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user.id!);
        if (!existingUser?.emailVerified) return false;

        // TODO: Add 2FA check
        return true;
    },
    async session({ token, session }) {
        if (token.sub && session.user) {
            session.user.id = token.sub;
        }
        if (token.role && session.user) {
            session.user.role = token.role as Role;
        }
        return session;
    },
    /**
     * Middleware NextAuth pour enrichir le token JWT avec les données de l'utilisateur
     * enregistrées en BDD.
     *
     * @param {Object} param0 - Informations du token JWT
     * @param {string} param0.sub - ID de l'utilisateur
     * @returns {Promise<Object>} - Le token JWT enrichi
     */
    async jwt({ token }) {
        if (!token.sub) return token;

        // Le token est enrichi avec les données de la BDD
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;
        
        token.role = existingUser.role;
        return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});