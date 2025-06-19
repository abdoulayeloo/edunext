// src/app/admin/formations/_components/formations-client.tsx
"use client";

import { Formation } from "@prisma/client";
import { Plus } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface FormationsClientProps {
  formations: Formation[];
}

export const FormationsClient = ({ formations }: FormationsClientProps) => {
  // Plus besoin de useState ici ! On récupère la fonction onOpen du store.
  const { onOpen } = useModal();

  return (
    <>
      {/* La Dialog a disparu, elle est gérée globalement par le ModalProvider */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Liste des formations ({formations.length})</h2>
        {/* Le bouton appelle directement la fonction du store */}
        <Button onClick={() => onOpen("createFormation")}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une formation
        </Button>
      </div>
      <DataTable columns={columns} data={formations} />
    </>
  );
};