// src/app/(app)/admin/users/_components/user-importer.tsx
"use client";

import { useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { importUsersFromCsv } from "@/actions/user";

interface UserImporterProps {
  onClose: () => void;
}

export const UserImporter = ({ onClose }: UserImporterProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const handleImport = () => {
    if (files.length === 0) {
      toast.error("Veuillez sélectionner un fichier CSV.");
      return;
    }
    const file = files[0];
    
    startTransition(() => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const users = results.data as any[];
                importUsersFromCsv(users).then(res => {
                    if (res.error) toast.error(res.error);
                    if (res.success) {
                        toast.success(`${res.success} ${res.createdCount} créés, ${res.errorCount} erreurs.`);
                        if (res.errors && res.errors.length > 0) {
                            console.error("Détails des erreurs:", res.errors);
                        }
                        onClose();
                    }
                });
            }
        });
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-muted-foreground/50 p-10 text-center rounded-lg cursor-pointer hover:bg-accent"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-y-2">
            <Upload className="h-10 w-10 text-muted-foreground"/>
            <p className="text-muted-foreground">
                Glissez-déposez un fichier CSV ici, ou cliquez pour sélectionner.
            </p>
        </div>
      </div>
      {files.length > 0 && (
        <p className="text-sm font-medium">Fichier sélectionné : {files[0].name}</p>
      )}
      <Button onClick={handleImport} disabled={isPending || files.length === 0} className="w-full">
        {isPending ? "Importation en cours..." : "Lancer l'importation"}
      </Button>
    </div>
  );
};