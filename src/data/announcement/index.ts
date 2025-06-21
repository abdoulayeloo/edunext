// src/data/announcement.ts
"use server";
import { prisma } from "@/lib/prisma";

export const getVisibleAnnouncements = async () => {
    try {
        // On récupère les 5 annonces les plus récentes
        const announcements = await prisma.announcement.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: { name: true }
                }
            }
        });
        return announcements;
    } catch {
        return [];
    }
}