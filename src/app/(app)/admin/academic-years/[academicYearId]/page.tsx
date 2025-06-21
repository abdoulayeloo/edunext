// src/app/(app)/admin/academic-years/[academicYearId]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Users, Library, Calendar } from "lucide-react";

import { getAcademicYearDetails } from "@/data/academic-year";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card"; // Réutilisons ce composant
import { EditButton } from "./_components/edit-button";

// Petit composant client pour le bouton d'édition pour utiliser le hook


const AcademicYearDetailPage = async ({
  params,
}: {
  params: { academicYearId: string };
}) => {
  const details = await getAcademicYearDetails(params.academicYearId);

  if (!details) {
    return redirect("/admin/academic-years");
  }

  const { academicYear, stats, activeFormations } = details;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Année Académique : {academicYear.year}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center mt-2">
            <Calendar className="h-4 w-4 mr-2" />
            Du {format(academicYear.startDate, "d MMMM yyyy", {
              locale: fr,
            })}{" "}
            au {format(academicYear.endDate, "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <EditButton academicYear={academicYear} />
      </div>

      {/* Section des Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Étudiants Inscrits"
          value={stats.studentCount}
          icon={Users}
        />
        <StatCard
          title="Formations Actives"
          value={stats.formationCount}
          icon={Library}
        />
      </div>

      {/* Section des Formations Actives */}
      <Card>
        <CardHeader>
          <CardTitle>
            {"Formations Actives durant l'année"} {academicYear.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeFormations.length > 0 ? (
            <div className="space-y-2">
              {activeFormations.map((formation) => (
                <Link
                  key={formation.id}
                  href={`/admin/formations/${formation.id}`}
                  legacyBehavior
                >
                  <a className="block p-3 rounded-md hover:bg-accent transition-colors border">
                    <p className="font-semibold">{formation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formation.diplomaLevel}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {
                "Aucune formation n'avait d'étudiants inscrits pour cette année académique."
              }
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicYearDetailPage;
