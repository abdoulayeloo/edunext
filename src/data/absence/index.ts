// src/data/absence.ts
"use server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const getAbsencesForCourseOnDate = async (ecId: string, date: Date) => {
    try {
        const absences = await prisma.absence.findMany({
            where: {
                ecId: ecId,
                date: {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                }
            },
            select: {
                studentId: true // On a juste besoin des IDs des étudiants absents
            }
        });
        return absences.map(a => a.studentId);
    } catch {
        return [];
    }
}