// src/app/admin/users/_components/users-client.tsx
"use client";

import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Upload } from "lucide-react";
import { UserImporter } from "./user-importer";

import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { DialogDescription } from "@radix-ui/react-dialog";

export const UsersClient = ({ data }: { data: User[] }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const router = useRouter();
  const handleRowClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };
  return (
    <>
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <UserForm onClose={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des utilisateurs par CSV</DialogTitle>
            <DialogDescription>
              Vous pouvez importer des utilisateurs en utilisant un fichier CSV.
            </DialogDescription>
          </DialogHeader>
          <UserImporter onClose={() => setIsImportModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Utilisateurs ({data.length})</h1>
        <div className="flex gap-x-2">
          <Button
            className="cursor-pointer"
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un utilisateur
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
    </>
  );
};
