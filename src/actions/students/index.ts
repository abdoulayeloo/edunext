// src/data/student.ts
"use server";

import { prisma } from "@/lib/prisma";

/**
 * Récupère et met en forme toutes les données académiques pour un étudiant donné.
 * @param userId L'ID de l'utilisateur (pas du profil étudiant)
 */
export const getStudentDashboardData = async (userId: string) => {
    try {
        const studentProfile = await prisma.student.findUnique({
            where: { userId },
            include: {
                enrollments: {
                    // On pourrait filtrer par année académique ici si nécessaire
                    orderBy: { academicYear: { startDate: 'desc' } },
                    include: {
                        formation: {
                            include: {
                                semesters: {
                                    orderBy: { name: 'asc' },
                                    include: {
                                        ues: {
                                            orderBy: { name: 'asc' },
                                            include: {
                                                ecs: {
                                                    orderBy: { name: 'asc' },
                                                    include: {
                                                        evaluations: {
                                                            orderBy: { date: 'asc' },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                grades: true, // On récupère toutes les notes de l'étudiant
            },
        });

        if (!studentProfile || !studentProfile.enrollments.length) {
            return null;
        }

        // On prend la dernière inscription comme inscription active
        const activeEnrollment = studentProfile.enrollments[0];
        const { formation } = activeEnrollment;

        // Traitement des données pour un affichage facile
        const processedSemesters = formation.semesters.map(semester => {
            const processedUEs = semester.ues.map(ue => {
                let ueTotalCredits = 0;
                let ueWeightedSum = 0;

                const processedECs = ue.ecs.map(ec => {
                    const evaluations = ec.evaluations;
                    const grades = studentProfile.grades.filter(g =>
                        evaluations.some(ev => ev.id === g.evaluationId)
                    );

                    // Calcul de la moyenne de l'EC (simple moyenne pour l'exemple)
                    const ecGrades = grades.map(g => g.value);
                    const ecAverage = ecGrades.length > 0
                        ? ecGrades.reduce((a, b) => a + b, 0) / ecGrades.length
                        : null;

                    if (ecAverage !== null && ecAverage >= 10) {
                        ueTotalCredits += ec.credits;
                        ueWeightedSum += ecAverage * ec.credits;
                    }

                    return { ...ec, average: ecAverage, grades };
                });

                const ueAverage = ueTotalCredits > 0 ? ueWeightedSum / ueTotalCredits : 0;

                return { ...ue, ecs: processedECs, average: ueAverage, isValidated: ueAverage >= 10 };
            });

            return { ...semester, ues: processedUEs };
        });

        return {
            formation: { ...formation, semesters: processedSemesters },
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'étudiant:", error);
        return null;
    }
};