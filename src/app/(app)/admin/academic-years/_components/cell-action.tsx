// src/app/(app)/admin/academic-years/_components/cell-action.tsx
"use client";

import { AcademicYear } from "@prisma/client";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CellActionProps { data: AcademicYear; }

export const CellAction = ({ data }: CellActionProps) => {
  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpen("editAcademicYear", { academicYear: data })}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">
            <Trash className="mr-2 h-4 w-4"/>
            Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};