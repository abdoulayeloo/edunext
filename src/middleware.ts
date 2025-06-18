// src/middleware.ts
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

// Mapping des rôles et de leurs pages d'accueil respectives
const roleHomePages: Record<string, string> = {
    ADMIN: "/admin",
    PROFESSOR: "/enseignant",
    STUDENT: "/etudiant",
};

export default auth((req) => {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;
    const isLoggedIn = !!req.auth;

    const userRole = req.auth?.user?.role;

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    // 1. Laisser passer les appels à l'API d'authentification
    if (isApiAuthRoute) {
        return;
    }

    // 2. Gérer les routes d'authentification (connexion, inscription)
    if (isAuthRoute) {
        if (isLoggedIn && userRole) {
            // Si un utilisateur connecté tente d'accéder à une page de connexion,
            // on le redirige vers sa page d'accueil.
            const homePage = roleHomePages[userRole];
            return NextResponse.redirect(new URL(homePage, nextUrl));
        }
        return; // Laisser passer si non connecté
    }

    // 3. Protéger les routes privées contre les utilisateurs non connectés
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        return NextResponse.redirect(new URL(`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl));
    }

    // 4. Logique de cloisonnement des rôles pour les utilisateurs connectés
    if (isLoggedIn && userRole) {
        // const homePage = roleHomePages[userRole];

        // Règle 1 : Un admin ne peut accéder qu'à /admin
        if (userRole === "ADMIN" && !pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin', nextUrl));
        }

        // Règle 2 : Un professeur ne peut accéder qu'à /enseignant
        if (userRole === "PROFESSOR" && !pathname.startsWith('/enseignant')) {
            return NextResponse.redirect(new URL('/enseignant', nextUrl));
        }

        // Règle 3 : Un étudiant ne peut accéder qu'à /etudiant
        if (userRole === "STUDENT" && !pathname.startsWith('/etudiant')) {
            return NextResponse.redirect(new URL('/etudiant', nextUrl));
        }
    }
    // 5. Si aucune règle n'a été déclenchée, autoriser l'accès.
    return;
});

// Le `matcher` optimise les performances en n'exécutant le middleware
// que sur les routes nécessaires.
export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};