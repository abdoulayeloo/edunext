// src/app/admin/formations/[formationId]/_components/formation-structure-client.tsx
"use client";

import { useState } from "react";
import { Formation, Semester, UE, EC, User } from "@prisma/client";
import { PlusCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Importez tous vos formulaires
import { UEForm } from "./ue-form";
import { ECForm } from "./ec-form";
// import { SemesterForm } from "./semester-form";

// Type complet de la structure
type FormationWithStructure = Formation & {
  semesters: (Semester & { ues: (UE & { ecs: EC[] })[] })[];
};

// ... (Définition des types ModalType et ModalData)
type ModalType = "createUE" | "editUE" | "createEC" | "editEC";
interface ModalData {
  semesterId?: string;
  ue?: UE;
  ueId?: string;
  ec?: EC;
}

interface FormationStructureClientProps {
  formation: FormationWithStructure;
  professors: User[]; // Accepte la liste des professeurs
}

export const FormationStructureClient = ({
  formation,
  professors,
}: FormationStructureClientProps) => {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const setModalOpen = (isOpen: boolean) => {
    setModal({ isOpen, type: modal.type, data: modal.data });
  };

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
      case "createEC":
        return (
          <ECForm
            ueId={modal.data.ueId!}
            professors={professors}
            onClose={closeModal}
          />
        );
      case "editEC":
        return (
          <ECForm
            ueId={modal.data.ec!.ueId}
            initialData={modal.data.ec}
            professors={professors}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={modal.isOpen} onOpenChange={setModalOpen}>
        <DialogContent>{renderModalContent()}</DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... (Partie pour les Semestres) ... */}
        <Card className="md:col-span-1">{/* ... */}</Card>

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
                  <CardContent>
                    <ul className="space-y-2 pl-4">
                      {ue.ecs.map((ec) => (
                        <li
                          key={ec.id}
                          className="flex justify-between items-center text-sm group"
                        >
                          <span>
                            {ec.name} ({ec.credits} ECTS)
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={() => openModal("editEC", { ec })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => openModal("createEC", { ueId: ue.id })}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ajouter un EC
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button
                size="sm"
                variant="default"
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
