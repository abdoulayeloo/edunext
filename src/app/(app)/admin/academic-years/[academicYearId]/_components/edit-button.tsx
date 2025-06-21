// src/app/(app)/admin/academic-years/[academicYearId]/_components/edit-button.tsx
"use client"; // On déclare ce fichier comme un composant client

import { AcademicYear } from "@prisma/client";
import { Edit } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

// On définit les props que le bouton attend
interface EditButtonProps {
    academicYear: AcademicYear;
}

export const EditButton = ({ academicYear }: EditButtonProps) => {
    // Maintenant, l'appel à useModal est valide car nous sommes dans un fichier "use client"
    const { onOpen } = useModal();

    return (
        <Button onClick={() => onOpen("editAcademicYear", { academicYear })}>
            <Edit className="h-4 w-4 mr-2"/>
            Modifier les dates
        </Button>
    );
};