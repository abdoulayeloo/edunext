// src/data/academic-year.ts
"use server";
import { prisma } from "@/lib/prisma";
export const getAcademicYears = async () => prisma.academicYear.findMany({ orderBy: { year: "desc" } });

// ... (votre fonction getAcademicYears existante)

/**
 * Récupère les détails complets d'une année académique, y compris
 * les statistiques et les formations associées.
 */
export const getAcademicYearDetails = async (id: string) => {
  try {
    const academicYear = await prisma.academicYear.findUnique({
      where: { id },
    });

    if (!academicYear) return null;

    // Compter le nombre total d'inscriptions pour cette année
    const totalEnrollments = await prisma.enrollment.count({
      where: { academicYearId: id },
    });

    // Récupérer les formations uniques qui ont des inscriptions cette année
    const activeFormations = await prisma.formation.findMany({
        where: {
            enrollments: {
                some: {
                    academicYearId: id,
                }
            }
        },
        distinct: ['id']
    });

    return {
      academicYear,
      stats: {
        studentCount: totalEnrollments,
        formationCount: activeFormations.length,
      },
      activeFormations,
    };
  } catch {
    return null;
  }
};