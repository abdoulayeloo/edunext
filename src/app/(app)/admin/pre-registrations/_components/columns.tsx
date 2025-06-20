"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PreRegistration } from "@prisma/client";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// On définit un type pour nos données de colonne, qui inclut la relation
export type PreRegistrationColumn = PreRegistration & {
  desiredProgram: {
    name: string;
  };
};

export const columns: ColumnDef<PreRegistrationColumn>[] = [
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom de Famille
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        // On peut combiner le nom et le prénom pour un affichage plus complet
        const name = `${row.original.firstName} ${row.original.lastName}`
        return <div className="font-medium">{name}</div>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "desiredProgram.name",
    header: "Formation Souhaitée",
  },
  {
    accessorKey: "createdAt",
    header: "Date de Soumission",
    cell: ({ row }) => {
      // On formate la date pour un affichage plus lisible
      const date = row.original.createdAt;
      return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/pre-registrations/${application.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Consulter
          </Link>
        </Button>
      );
    },
  },
];