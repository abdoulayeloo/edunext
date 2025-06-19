// src/data/enrollment.ts
"use server";
import { prisma } from "@/lib/db";

export const getEnrolledStudentsByFormation = async (formationId: string) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { formationId },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                student: {
                    user: {
                        name: 'asc'
                    }
                }
            }
        });
        return enrollments;
    } catch {
        return [];
    }
};

export const getStudentsNotInFormation = async (formationId: string) => {
    try {
        const enrolledStudentIds = (await prisma.enrollment.findMany({
            where: { formationId },
            select: { studentId: true }
        })).map(e => e.studentId);

        const availableStudents = await prisma.student.findMany({
            where: {
                id: {
                    notIn: enrolledStudentIds
                }
            },
            include: {
                user: true
            }
        });
        return availableStudents;
    } catch {
        return [];
    }
}