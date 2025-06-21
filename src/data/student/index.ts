// src/data/student.ts
"use server";

import { prisma } from "@/lib/prisma";

export const getStudentDashboardData = async (userId: string) => {
  try {
    const studentProfile = await prisma.student.findUnique({
      where: { userId: userId },
      include: {
        user: true,
        enrollments: {
          take: 1,
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
        grades: {
            include: {
                evaluation: {
                    // On dit à Prisma d'inclure aussi l'EC lié à chaque évaluation
                    include: {
                        ec: true 
                    }
                }
            },
            orderBy: {
                evaluation: {
                    date: 'desc'
                }
            }
        },
        absences: {
          include: {
            ec: true
          },
          orderBy: { date: 'desc' }
        },
      },
    });

    if (!studentProfile || studentProfile.enrollments.length === 0) {
      return null;
    }

    const activeEnrollment = studentProfile.enrollments[0];
    const { formation } = activeEnrollment;

    // Traitement des données pour enrichir chaque niveau (EC, UE)
    const processedSemesters = formation.semesters.map(semester => {
        const processedUEs = semester.ues.map(ue => {
            let ueWeightedSum = 0;
            let ueTotalCreditsCounted = 0; // On ne compte que les crédits des ECs notés

            const processedECs = ue.ecs.map(ec => {
                const gradesForEc = studentProfile.grades.filter(g => 
                    ec.evaluations.some(ev => ev.id === g.evaluationId)
                );
                
                const ecGradesValues = gradesForEc.map(g => g.value);
                const ecAverage = ecGradesValues.length > 0 
                    ? ecGradesValues.reduce((a, b) => a + b, 0) / ecGradesValues.length
                    : null;

                if (ecAverage !== null && ecAverage >= 10) {
                  ueWeightedSum += ecAverage * ec.credits;
                  ueTotalCreditsCounted += ec.credits;
                }

                // On attache les notes trouvées à l'EC
                return { ...ec, average: ecAverage, grades: gradesForEc };
            });

            const ueAverage = ueTotalCreditsCounted > 0 ? ueWeightedSum / ueTotalCreditsCounted : 0;

            // On attache les ECs traités et les stats à l'UE
            return { ...ue, ecs: processedECs, average: ueAverage, isValidated: ueAverage >= 10 };
        });

        // On attache les UEs traitées au semestre
        return { ...semester, ues: processedUEs };
    });

    // --- LA CORRECTION PRINCIPALE EST ICI ---
    // On crée l'objet final avec la structure de données traitée
    const fullProcessedFormationData = {
        ...formation,
        semesters: processedSemesters,
    };

    // Calcul des statistiques globales
    const allGrades = studentProfile.grades.map(g => g.value);
    const averageGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;
    
    return {
      user: studentProfile.user, // Prisma ne retourne pas la relation inverse par défaut
      stats: {
        averageGrade: averageGrade.toFixed(2),
        totalAbsences: studentProfile.absences.length,
        validatedECTS: 0, // TODO
      },
      recentGrades: studentProfile.grades.slice(0, 5),
      recentAbsences: studentProfile.absences.slice(0, 5),
      fullFormationData: fullProcessedFormationData, // On retourne la structure enrichie
    };

  } catch (error) {
    console.error("Erreur de récupération des données étudiant:", error);
    return null;
  }
};