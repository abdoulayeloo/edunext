// src/app/admin/formations/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Formation } from "@prisma/client";
import { CellAction } from "./cell-action"; // Importez le composant

export const columns: ColumnDef<Formation>[] = [
  { accessorKey: "name", header: "Nom de la Formation" },
  { accessorKey: "diplomaLevel", header: "Niveau de Diplôme" },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />, // Utilisez CellAction ici
  },
];
