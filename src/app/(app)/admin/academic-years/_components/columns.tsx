// src/app/(app)/admin/academic-years/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AcademicYear } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<AcademicYear>[] = [
  {
    accessorKey: "year",
    header: "Année",
  },
  {
    accessorKey: "startDate",
    header: "Date de début",
    cell: ({ row }) =>
      format(row.original.startDate, "d MMMM yyyy", { locale: fr }),
  },
  {
    accessorKey: "endDate",
    header: "Date de fin",
    cell: ({ row }) =>
      format(row.original.endDate, "d MMMM yyyy", { locale: fr }),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
