// src/app/(app)/etudiant/absences/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Accès direct à la BDD pour une requête simple
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";

// Fonction de récupération de données spécifique à cette page
const getAbsences = async (userId: string) => {
    const absences = await prisma.absence.findMany({
        where: { student: { userId: userId } },
        include: { ec: true },
        orderBy: { date: 'desc' }
    });
    return absences;
}

const AbsencesPage = async () => {
    const session = await auth();
    if (!session?.user?.id) return redirect("/");

    const absences = await getAbsences(session.user.id);

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Historique de mes absences ({absences.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={absences} />
                </CardContent>
            </Card>
        </div>
    )
}

export default AbsencesPage;