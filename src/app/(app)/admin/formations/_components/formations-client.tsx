// src/app/admin/formations/_components/formations-client.tsx
"use client";

import { useState } from "react";
import { Formation } from "@prisma/client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table"; // Note: chemin mis à jour pour un composant réutilisable
import { getColumns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormationForm } from "./formation-form";

interface FormationsClientProps {
  formations: Formation[];
}

export const FormationsClient = ({ formations }: FormationsClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const onEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setIsModalOpen(true);
  };

  const onCreate = () => {
    setEditingFormation(null);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const columns = getColumns(onEdit);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFormation ? "Modifier la formation" : "Créer une nouvelle formation"}
            </DialogTitle>
          </DialogHeader>
          <FormationForm initialData={editingFormation} onClose={onClose} />
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Liste des formations ({formations.length})</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une formation
        </Button>
      </div>
      <DataTable columns={columns} data={formations} />
    </>
  );
};