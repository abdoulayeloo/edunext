// src/data/formation.ts
import { prisma } from "@/lib/db";

export const getFormations = async () => {
    try {
        const formations = await prisma.formation.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return formations;
    } catch {
        return [];
    }
};

export const getFormationById = async (formationId: string) => {
    try {
        const formation = await prisma.formation.findUnique({
            where: { id: formationId },
            include: {
                semesters: {
                    orderBy: { name: "asc" },
                    include: {
                        ues: {
                            orderBy: { name: "asc" },
                            include: {
                                ecs: {
                                    orderBy: { name: "asc" },
                                },
                            },
                        },
                    },
                },
            },
        });
        return formation;
    } catch {
        return null;
    }
};