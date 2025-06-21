// src/data/audit-log.ts
"use server";
import { prisma } from "@/lib/prisma";

export const getAuditLogs = async () => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 10, // On ne prend que les 10 plus récents pour le dashboard
        });
        return logs;
    } catch {
        return [];
    }
}