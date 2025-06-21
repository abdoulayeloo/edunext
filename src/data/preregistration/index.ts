import { prisma } from '../../lib/prisma';
export const getPendingPreRegistrations = async () => {
    return prisma.preRegistration.findMany({
        where: { status: "PENDING" },
        include: { desiredProgram: { select: { name: true }}},
        orderBy: { createdAt: "asc" },
    });
}

export const getPreRegistrationById = async (id: string) => {
    return prisma.preRegistration.findUnique({
        where: { id },
        include: { desiredProgram: { select: { name: true }}}
    });
}