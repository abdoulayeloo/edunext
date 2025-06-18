// src/app/admin/formations/[formationId]/_components/formation-structure-client.tsx
"use client";

import { useState } from "react";
import { Formation, Semester, UE, EC } from "@prisma/client";
import { PlusCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";


import { UEForm } from "./ue-form";
import { SemesterForm } from "./semester-form";
// import { ECForm } from "./ec-form";

// Type complet de la structure
type FormationWithStructure = Formation & {
  semesters: (Semester & { ues: (UE & { ecs: EC[] })[] })[];
};

// Définition des types pour la modale
type ModalType =
  | "createUE"
  | "editUE"
  | "createSemester"
  | "editSemester"
  | "createEC"
  | "editEC";
interface ModalData {
  semester?: Semester;
  ue?: UE;
  ec?: EC;
}

export const FormationStructureClient = ({
  formation,
}: {
  formation: FormationWithStructure;
}) => {
  const [activeSemester, setActiveSemester] = useState(
    formation.semesters[0] || null
  );
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data: ModalData;
  }>({
    isOpen: false,
    type: null,
    data: {},
  });

  const openModal = (type: ModalType, data: ModalData = {}) =>
    setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: null, data: {} });

  const renderModalContent = () => {
    switch (modal.type) {
      case "createUE":
        return <UEForm semesterId={activeSemester!.id} onClose={closeModal} />;
      case "editUE":
        return (
          <UEForm
            semesterId={activeSemester!.id}
            initialData={modal.data.ue}
            onClose={closeModal}
          />
        );
      // Ajoutez les cas pour Semester et EC ici...
      case "createSemester":
        return <SemesterForm formationId={formation.id} onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>{renderModalContent()}</DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Semestres
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openModal("createSemester")}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formation.semesters.map((semester) => (
              <div key={semester.id} className="flex items-center group">
                <Button
                  variant={
                    activeSemester?.id === semester.id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveSemester(semester)}
                >
                  {semester.name}
                </Button>
                {/* Actions pour le semestre apparaissent au survol */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {activeSemester ? (
            <>
              {activeSemester.ues.map((ue) => (
                <Card key={ue.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-lg">
                      {ue.name} ({ue.totalCredits} ECTS)
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openModal("editUE", { ue })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{/* ... affichage des ECs ... */}</CardContent>
                </Card>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => openModal("createUE")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une UE au {activeSemester.name}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/30">
              <p className="text-muted-foreground">
                Sélectionnez ou créez un semestre.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
