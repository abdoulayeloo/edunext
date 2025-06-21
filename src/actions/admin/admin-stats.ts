// src/data/admin-stats.ts
import { prisma } from "@/lib/prisma";

/**
 * Récupère le nombre total d'utilisateurs par rôle.
 */
export const getUsersCount = async () => {
    try {
        const studentCount = await prisma.user.count({ where: { role: "STUDENT" } });
        const professorCount = await prisma.user.count({ where: { role: "PROFESSOR" } });
        return { students: studentCount, professors: professorCount };
    } catch {
        return { students: 0, professors: 0 };
    }
};

/**
 * Récupère le nombre total de formations créées.
 */
export const getFormationsCount = async () => {
    try {
        const count = await prisma.formation.count();
        return count;
    } catch {
        return 0;
    }
};