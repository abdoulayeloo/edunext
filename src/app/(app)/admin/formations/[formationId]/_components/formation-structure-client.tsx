// src/app/admin/formations/[formationId]/_components/formation-structure-client.tsx
"use client";

import { useState, useTransition } from "react";
import { Formation, Semester, UE, EC, User } from "@prisma/client";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSemester } from "@/actions/semesters/";
import { deleteUE, deleteEC } from "@/actions/UEs";

// Types
type FormationWithStructure = Formation & {
  semesters: (Semester & { ues: (UE & { ecs: EC[] })[] })[];
};
interface FormationStructureClientProps {
  formation: FormationWithStructure;
  professors: User[];
}

// Composant principal
export const FormationStructureClient = ({
  formation,
  professors,
}: FormationStructureClientProps) => {
  const { onOpen } = useModal();
  const [isPending, startTransition] = useTransition();

  const [activeSemester, setActiveSemester] = useState<(Semester & { ues: (UE & { ecs: EC[] })[] }) | null>(formation.semesters[0] || null);

  // State pour la modale de suppression
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "semester" | "ue" | "ec";
    id: string;
  } | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;

    startTransition(() => {
      let action;
      if (deleteTarget.type === "semester")
        action = deleteSemester(deleteTarget.id);
      else if (deleteTarget.type === "ue") action = deleteUE(deleteTarget.id);
      else if (deleteTarget.type === "ec") action = deleteEC(deleteTarget.id);
      else return;

      action
        .then((res) => {
          if (res.error) toast.error(res.error);
          if (res.success) toast.success(res.success);
          setDeleteTarget(null);
        })
        .catch(() => toast.error("Une erreur est survenue."));
    });
  };

  return (
    <>
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              {"Cette action est irréversible et supprimera l'élément de manière permanente."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Suppression..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne des Semestres */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Semestres
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onOpen("createSemester", { formationId: formation.id })
                }
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formation.semesters.map((semester) => (
              <div key={semester.id} className="flex items-center group gap-3">
                <Button
                  variant={
                    activeSemester?.id === semester.id ? "secondary" : "ghost"
                  }
                  className="w-4/5 justify-start"
                  onClick={() => setActiveSemester(semester)}
                >
                  {semester.name}
                </Button>
                <div className="transition-opacity flex items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() =>
                      onOpen("editSemester", {
                        semester,
                        formationId: formation.id,
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() =>
                      setDeleteTarget({ type: "semester", id: semester.id })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Colonne des UE et EC */}
        <div className="md:col-span-2 space-y-6">
          {activeSemester ? (
            <>
              {activeSemester.ues.map((ue) => (
                <Card key={ue.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-lg">
                      {ue.name} ({ue.totalCredits} ECTS)
                      <div className="flex items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() =>
                            onOpen("editUE", {
                              ue,
                              semesterId: activeSemester.id,
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({ type: "ue", id: ue.id })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 pl-4">
                      {ue.ecs.map((ec: EC) => (
                        <li
                          key={ec.id}
                          className="flex justify-between items-center text-sm group"
                        >
                          <span>
                            {ec.name} ({ec.credits} ECTS)
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                onOpen("editEC", {
                                  ec,
                                  ueId: ue.id,
                                  professors,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() =>
                                setDeleteTarget({ type: "ec", id: ec.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() =>
                        onOpen("createEC", { ueId: ue.id, professors })
                      }
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Ajouter un EC
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {/* Le bouton pour ajouter une nouvelle UE */}
              <Button
                size="sm"
                variant="default"
                className="w-full"
                onClick={() =>
                  onOpen("createUE", { semesterId: activeSemester.id })
                }
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une UE au {activeSemester.name}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/30">
              <p className="text-muted-foreground">
                Sélectionnez ou créez un semestre pour gérer sa structure.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
