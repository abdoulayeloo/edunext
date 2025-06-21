"use client";

import { useState, useEffect } from "react";
import {
  BookMarked,
  ChevronRight,
  NotebookTabs,
  CalendarCheck2,
  MessageSquare,
} from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GradeInputCell } from "./grade-input-cell";
import { AbsenceManager } from "./absence-manager";
import { getAbsencesForCourseOnDate } from "@/data/absence";

// Types pour les données du tableau de bord, dérivés de vos fonctions de récupération
type DashboardData = Awaited<
  ReturnType<typeof import("@/data/professor").getProfessorDashboardData>
>;
type CourseWithDetails = DashboardData[0];

interface ProfessorDashboardClientProps {
  data: DashboardData;
}

export const ProfessorDashboardClient = ({
  data,
}: ProfessorDashboardClientProps) => {
  // State pour le cours actuellement sélectionné
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithDetails | null>(data[0] || null);
  // State pour les absences (pour le composant AbsenceManager)
  const [absences, setAbsences] = useState<string[]>([]);

  const { onOpen } = useModal();

  // Effet pour charger les absences quand le cours sélectionné change
  useEffect(() => {
    if (!selectedCourse) return;

    // On charge les absences pour la date d'aujourd'hui par défaut
    getAbsencesForCourseOnDate(selectedCourse.id, new Date()).then(setAbsences);
  }, [selectedCourse]);

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
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
      {/* Colonne de gauche : Liste des cours */}
      <div className="md:col-span-1 lg:col-span-1">
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
                className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${selectedCourse?.id === course.id ? "bg-secondary" : "hover:bg-accent"}`}
              >
                <div>
                  <p className="font-semibold text-sm">{course.name}</p>
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

      {/* Colonne de droite : Détails du cours sélectionné avec onglets */}
      <div className="md:col-span-2 lg:col-span-3">
        {selectedCourse ? (
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                <NotebookTabs className="mr-2 h-4 w-4" /> Saisie des Notes
              </TabsTrigger>
              <TabsTrigger value="absences">
                <CalendarCheck2 className="mr-2 h-4 w-4" /> Gestion des Absences
              </TabsTrigger>
            </TabsList>

            {/* Onglet pour les notes */}
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes pour {selectedCourse.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total : {selectedCourse.students.length} étudiant(s)
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className=" font-semibold">
                          Étudiant
                        </TableHead>
                        <TableHead className=" font-semibold">
                          Email
                        </TableHead>
                        {selectedCourse.evaluations.map((evaluation) => (
                          <TableHead
                            key={evaluation.id}
                            className="text-center font-semibold"
                          >
                            {evaluation.type}
                          </TableHead>
                        ))}
                        <TableHead className="text-right font-semibold">
                          Appréciation
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCourse.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.email}
                          </TableCell>
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
                          <TableCell>
                            <GradeInputCell studentId={""}
                             evaluationId={""}
                             initialValue={null}/>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                onOpen("editAppreciation", {
                                  enrollment: student.enrollment,
                                })
                              }
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet pour les absences */}
            <TabsContent value="absences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {"Feuille d'appel pour"} {selectedCourse.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez une date et cochez les étudiants absents.
                  </p>
                </CardHeader>
                <CardContent>
                  <AbsenceManager
                    courseId={selectedCourse.id}
                    students={selectedCourse.students}
                    initialAbsences={absences}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Sélectionnez un cours pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
