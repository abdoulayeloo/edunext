"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Grade, EC, UE, Semester, Formation } from "@prisma/client";

// --- DÉFINITION DES TYPES ENRICHIS ---

// Un EC avec sa moyenne et ses notes calculées
type ProcessedEC = EC & {
  average: number | null;
  grades: Grade[];
};

// Une UE avec sa moyenne, son statut de validation, et ses ECs traités
type ProcessedUE = UE & {
  average: number;
  isValidated: boolean;
  ecs: ProcessedEC[];
};

// Un Semestre avec ses UEs traitées
type ProcessedSemester = Semester & {
  ues: ProcessedUE[];
};

// La Formation complète avec sa structure traitée
type ProcessedFormation = Formation & {
  semesters: ProcessedSemester[];
};

// Interface des props qui utilise notre nouveau type
interface NotesClientProps {
  formation: ProcessedFormation;
}


// --- LE COMPOSANT ---

export const NotesClient = ({ formation }: NotesClientProps) => {
  return (
    <div className="w-full space-y-6">
      {formation.semesters.map((semester) => (
        <Card key={semester.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{semester.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              className="w-full space-y-3"
              defaultValue={semester.ues.map((ue) => ue.id)}
            >
              {semester.ues.map((ue) => (
                <Card key={ue.id} className="overflow-hidden rounded-lg">
                  <AccordionItem value={ue.id} className="border-b-0">
                    <AccordionTrigger className="bg-muted/50 px-4 py-3 hover:no-underline flex justify-between w-full">
                      <div className="text-left">
                        <p className="font-semibold">{ue.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Crédits ECTS : {ue.totalCredits}
                        </p>
                      </div>
                      <div className="flex items-center gap-x-4 pr-2">
                        <span className="text-sm font-medium">
                          Moyenne UE:{" "}
                          <span className="font-bold">
                            {ue.average ? ue.average.toFixed(2) : "-"} / 20
                          </span>
                        </span>
                        <Badge
                          variant={ue.isValidated ? "default" : "destructive"}
                          className="w-24 justify-center"
                        >
                          {ue.isValidated ? "Validé" : "Non validé"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">
                              Élément Constitutif (EC)
                            </TableHead>
                            <TableHead className="font-semibold">
                              Note(s) Obtenue(s)
                            </TableHead>
                            <TableHead className="text-right font-semibold">
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
                                <div className="flex gap-x-2">
                                  {ec.grades.length > 0 ? (
                                    ec.grades.map((g) => (
                                      <Badge variant="secondary" key={g.id}>
                                        {g.value.toFixed(2)}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      Aucune note
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-bold">
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
    </div>
  );
};