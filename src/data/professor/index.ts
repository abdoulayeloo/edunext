import { prisma } from '../../lib/prisma';
/**
 * Récupère toutes les données nécessaires pour le tableau de bord d'un professeur.
 * @param userId L'ID de l'utilisateur (pas du profil professeur)
 */
export const getProfessorDashboardData = async (userId: string) => {
    try {
        // 1. Trouver tous les ECs enseignés par ce professeur
        const taughtECs = await prisma.eC.findMany({
            where: {
                professor: {
                    userId: userId,
                },
            },
            include: {
                evaluations: {
                    orderBy: { date: "asc" },
                },
                ue: {
                    include: {
                        semester: {
                            include: {
                                formation: true,
                            },
                        },
                    },
                },
            },
        });

        if (!taughtECs.length) {
            return [];
        }

        // 2. Pour chaque EC, récupérer la liste des étudiants inscrits dans la formation correspondante
        const dashboardData = await Promise.all(
            taughtECs.map(async (ec) => {
                const enrollments = await prisma.enrollment.findMany({
                    where: {
                        formationId: ec.ue.semester.formationId,
                        // Optionnel: filtrer par année académique si nécessaire
                    },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: { id: true, name: true, email: true },
                                },
                                grades: {
                                    where: {
                                        evaluation: {
                                            ecId: ec.id,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                // Formatter les données pour ne retourner que les infos utiles
                const students = enrollments.map(enrollment => ({
                    ...enrollment.student.user,
                    studentProfileId: enrollment.student.id,
                    grades: enrollment.student.grades,
                    enrollment: enrollment, // <-- On passe l'objet Enrollment entier
                }));

                return { ...ec, students };
            })
        );

        return dashboardData;
    } catch (error) {
        console.error("Error fetching professor dashboard data:", error);
        return [];
    }
};