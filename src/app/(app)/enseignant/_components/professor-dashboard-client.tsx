// src/app/enseignant/_components/professor-dashboard-client.tsx
"use client";

import { useState } from "react";
// import { BookMarked, Users, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradeInputCell } from "./grade-input-cell";

// ... (vos types DashboardData, CourseWithStudents)
type DashboardData = Awaited<
  ReturnType<
    typeof import("@/actions/professors/index").getProfessorDashboardData
  >
>;
type CourseWithStudents = DashboardData[0];

export const ProfessorDashboardClient = ({ data }: { data: DashboardData }) => {
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithStudents | null>(data[0] || null);

  if (!data || data.length === 0) {
    /* ... (votre code existant) ... */
    return null;
  }
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ... (votre colonne de gauche avec la liste des cours) ... */}

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Formation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Formation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((course) => (
                  <TableRow
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{course.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        {selectedCourse ? (
          <Card>
            <CardHeader>
              <CardTitle>{`Saisie des notes pour ${selectedCourse.name}`}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total : {selectedCourse.students.length} étudiant(s)
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Étudiant</TableHead>
                    {/* Générer dynamiquement les colonnes d'évaluation */}
                    {selectedCourse.evaluations.map((evaluation) => (
                      <TableHead key={evaluation.id} className="text-center">
                        {evaluation.type}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCourse.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      {/* Pour chaque étudiant, générer une cellule de saisie par évaluation */}
                      {selectedCourse.evaluations.map((evaluation) => {
                        const grade = student.grades.find(
                          (g) => g.evaluationId === evaluation.id
                        );
                        return (
                          <TableCell
                            key={evaluation.id}
                            className="flex justify-center"
                          >
                            <GradeInputCell
                              studentId={student.studentProfileId}
                              evaluationId={evaluation.id}
                              initialValue={grade?.value}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Sélectionnez un cours pour la saisie des notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
