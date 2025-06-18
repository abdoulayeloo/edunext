// src/app/enseignant/_components/professor-dashboard-client.tsx
"use client";

import { useState } from "react";
import { BookMarked, Users, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type pour les données du tableau de bord
// (Il est recommandé de le mettre dans un fichier de types partagé)
type DashboardData = Awaited<
  ReturnType<
    typeof import("@/actions/professors/index").getProfessorDashboardData
  >
>;
type CourseWithStudents = DashboardData[0];

interface ProfessorDashboardClientProps {
  data: DashboardData;
}

export const ProfessorDashboardClient = ({
  data,
}: ProfessorDashboardClientProps) => {
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithStudents | null>(data[0] || null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">
          Aucun cours ne vous est assigné pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Colonne de gauche : Liste des cours */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookMarked className="mr-2 h-5 w-5" />
              Mes Enseignements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${
                  selectedCourse?.id === course.id
                    ? "bg-secondary"
                    : "hover:bg-accent"
                }`}
              >
                <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.ue.semester.formation.name}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Colonne de droite : Détails du cours sélectionné */}
      <div className="md:col-span-2">
        {selectedCourse ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                {`Étudiants Inscrits à ${selectedCourse.name}`}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total : {selectedCourse.students.length} étudiant(s)
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCourse.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-center">
                        {/* Placeholder pour la saisie de note */}
                        <span className="text-muted-foreground">-</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Sélectionnez un cours pour voir les étudiants.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
