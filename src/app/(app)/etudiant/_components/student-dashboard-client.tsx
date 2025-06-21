"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Type pour les données formatées
type DashboardData = Awaited<
  ReturnType<typeof import("@/actions/students/index").getStudentDashboardData>
>;
type FormationWithProcessedStructure = NonNullable<DashboardData>["formation"];

interface StudentDashboardClientProps {
  formation: FormationWithProcessedStructure;
}

export const StudentDashboardClient = ({
  formation,
}: StudentDashboardClientProps) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={formation.semesters.map((s) => s.id)}
      className="w-full space-y-4"
    >
      {formation.semesters.map((semester) => (
        <Card key={semester.id}>
          <CardHeader>
            <CardTitle>{semester.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-2">
              {semester.ues.map((ue) => (
                <Card key={ue.id} className="overflow-hidden">
                  <AccordionItem value={ue.id} className="border-b-0">
                    <AccordionTrigger className="bg-muted/50 px-4 py-2 hover:no-underline flex justify-between">
                      <div>
                        <p className="font-semibold">{ue.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Crédits ECTS : {ue.totalCredits}
                        </p>
                      </div>
                      <div className="flex items-center gap-x-4 pr-2">
                        <span className="text-sm">
                          Moyenne UE:{" "}
                          <span className="font-bold">
                            {ue.average.toFixed(2)} / 20
                          </span>
                        </span>
                        <Badge
                          variant={ue.isValidated ? "default" : "destructive"}
                        >
                          {ue.isValidated ? "Validé" : "Non validé"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Élément Constitutif (EC)</TableHead>
                            <TableHead>Note(s)</TableHead>
                            <TableHead className="text-right">
                              Moyenne EC
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ue.ecs.map((ec) => (
                            <TableRow key={ec.id}>
                              <TableCell className="font-medium">
                                {ec.name}
                              </TableCell>
                              <TableCell>
                                {ec.grades.map((g) => g.value).join(" / ")}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {ec.average !== null
                                  ? ec.average.toFixed(2)
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </Accordion>
  );
};
