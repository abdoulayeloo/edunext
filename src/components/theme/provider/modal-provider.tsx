// src/components/providers/modal-provider.tsx
"use client";

import { useEffect, useState } from "react";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SemesterForm } from "@/app/(app)/admin/formations/[formationId]/_components/semester-form";
import { UEForm } from "@/app/(app)/admin/formations/[formationId]/_components/ue-form";
import { ECForm } from "@/app/(app)/admin/formations/[formationId]/_components/ec-form";
import { FormationForm } from "@/app/(app)/admin/formations/_components/formation-form";

// Importez tous vos formulaires

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { isOpen, onClose, type, data } = useModal();

  if (!isMounted) return null;

  const handleClose = () => {
    onClose();
  };

  const renderModalContent = () => {
    switch (type) {
      case "createSemester":
        return (
          <SemesterForm formationId={data.formationId!} onClose={handleClose} />
        );
      case "editSemester":
        return (
          <SemesterForm
            initialData={data.semester}
            formationId={data.formationId!}
            onClose={handleClose}
          />
        );

      case "createUE":
        return <UEForm semesterId={data.semesterId!} onClose={handleClose} />;
      case "editUE":
        return (
          <UEForm
            initialData={data.ue}
            semesterId={data.semesterId!}
            onClose={handleClose}
          />
        );

      case "createEC":
        return (
          <ECForm
            ueId={data.ueId!}
            professors={data.professors!}
            onClose={handleClose}
          />
        );
      case "editEC":
        return (
          <ECForm
            initialData={data.ec}
            ueId={data.ueId!}
            professors={data.professors!}
            onClose={handleClose}
          />
        );
      case "createFormation":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle formation</DialogTitle>
            </DialogHeader>
            <FormationForm onClose={handleClose} />
          </>
        );
      case "editFormation":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Modifier la formation</DialogTitle>
            </DialogHeader>
            <FormationForm initialData={data.formation} onClose={handleClose} />
          </>
        );
      default:
        return null;
    }
  };

  // Génère un titre pour la modale en fonction du type
  const getTitle = () => {
    if (!type) return "";
    if (type.startsWith("create")) return "Nouvel élément";
    if (type.startsWith("edit")) return "Modifier l'élément";
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};
