// src/app/(app)/etudiant/absences/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Absence, EC } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// On définit un type qui inclut la relation avec l'EC
type AbsenceColumn = Absence & {
  ec: EC;
};

export const columns: ColumnDef<AbsenceColumn>[] = [
  {
    accessorKey: "ec.name",
    header: "Cours",
  },
  {
    accessorKey: "date",
    header: "Date de l'absence",
    cell: ({ row }) => {
      const date = row.original.date;
      return format(date, "PPPP", { locale: fr });
    },
  },
  {
    accessorKey: "justified",
    header: "Statut",
    cell: ({ row }) => {
      const isJustified = row.original.justified;
      return (
        <Badge variant={isJustified ? "secondary" : "destructive"}>
          {isJustified ? "Justifiée" : "Non justifiée"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Commentaire",
    cell: ({ row }) => row.original.comment || "-",
  },
];
