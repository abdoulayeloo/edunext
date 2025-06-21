import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email, } })
        return user;
    } catch {
        return null;
    }
}


export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } })

        return user;
    } catch {
        return null;
    }
}

export const getProfessors = async () => {
    try {
        const professors = await prisma.user.findMany({
            where: { role: "PROFESSOR" },
        });
        return professors;
    } catch {
        return [];
    }
};

export const getUserDetails = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                // Inclure le profil étudiant avec ses inscriptions et formations
                studentProfile: {
                    include: {
                        enrollments: {
                            include: {
                                formation: true,
                                academicYear: true,
                            },
                            orderBy: { academicYear: { year: 'desc' } },
                        },
                    },
                },
                // Inclure le profil professeur avec les cours qu'il enseigne
                professorProfile: {
                    include: {
                        coursesTaught: {
                            include: {
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
                            orderBy: { name: 'asc' },
                        },
                    },
                },
            },
        });
        return user;
    } catch {
        return null;
    }
};