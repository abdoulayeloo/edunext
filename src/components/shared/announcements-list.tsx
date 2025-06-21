// src/components/shared/announcements-list.tsx
import { Announcement } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnnouncementWithAuthor = Announcement & { author: { name: string | null }};

interface AnnouncementsListProps {
    announcements: AnnouncementWithAuthor[];
}

export const AnnouncementsList = ({ announcements }: AnnouncementsListProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5"/> Annonces Récentes
                </CardTitle>
            </CardHeader>
            <CardContent>
                {announcements.length > 0 ? (
                    <ul className="space-y-4">
                        {announcements.map(announcement => (
                            <li key={announcement.id} className="border-l-4 border-sky-500 pl-4 py-1">
                                <p className="font-semibold">{announcement.title}</p>
                                <p className="text-sm">{announcement.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Publié le {format(announcement.createdAt, "d MMMM", { locale: fr })} par {announcement.author.name}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucune nouvelle annonce.</p>
                )}
            </CardContent>
        </Card>
    )
}