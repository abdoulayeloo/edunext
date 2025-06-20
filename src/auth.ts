// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

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