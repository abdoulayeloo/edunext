// src/app/admin/formations/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Formation } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { CellAction } from "./cell-action"; // Importez le nouveau composant

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
  onEdit: (formation: Formation) => void
): ColumnDef<Formation>[] => [
  // ... Colonne 'name'
  // ... Colonne 'diplomaLevel'
  {
    accessorKey: "name",
    header: "Nom de la Formation",
  },
  {
    accessorKey: "diplomaLevel",
    header: "Niveau de Diplôme",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} onEdit={() => onEdit(row.original)} />,
  },
];

// Définition des colonnes
export const columns: ColumnDef<Formation>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de la Formation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "diplomaLevel",
    header: "Niveau de Diplôme",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formation = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(formation.id)}
            >
              {"Copier l'ID"}
            </DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              {"Supprimer"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
