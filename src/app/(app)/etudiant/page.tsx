// src/app/(app)/etudiant/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentDashboardData } from "@/data/student";
import { Percent, UserX, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadTranscriptButton } from "./_components/download-transcript-button";

import { getVisibleAnnouncements } from "@/data/announcement";
import { AnnouncementsList } from "@/components/shared/announcements-list";

const StudentDashboardPage = async () => {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return redirect("/");
  }

  const [data, announcements] = await Promise.all([
    getStudentDashboardData(session!.user.id!),
    getVisibleAnnouncements(),
  ]);

  if (!data) {
    return (
      <div className="p-6">
        <p>{"Vous n'êtes inscrit à aucune formation."}</p>
      </div>
    );
  }

  const { stats, recentGrades, recentAbsences } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Moyenne Générale"
          value={`${stats.averageGrade} / 20`}
          icon={Percent}
        />
        <StatCard
          title="Crédits ECTS Validés"
          value={`${stats.validatedECTS}`}
          icon={CheckCircle}
        />
        <StatCard title="Absences" value={stats.totalAbsences} icon={UserX} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Évaluation</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {grade.evaluation.ec.name}
                    </TableCell>
                    <TableCell>{grade.evaluation.type}</TableCell>
                    <TableCell className="text-right font-bold">
                      {grade.value.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Absences Récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Absences Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAbsences.map((absence) => (
                  <TableRow key={absence.id}>
                    <TableCell className="font-medium">
                      {absence.ec.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {format(absence.date, "PPP", { locale: fr })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementsList announcements={announcements} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Documents Officiels
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            {data && <DownloadTranscriptButton data={data} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
