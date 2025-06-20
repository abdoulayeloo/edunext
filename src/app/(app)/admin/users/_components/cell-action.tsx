// src/app/admin/users/_components/cell-action.tsx
"use client";

import { User } from "@prisma/client";
import { MoreHorizontal, UserX, UserCheck } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleUserActiveState } from "@/actions/user";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CellActionProps { data: User; }

export const CellAction = ({ data }: CellActionProps) => {
    const [isPending, startTransition] = useTransition();

    const onToggleActive = () => {
        startTransition(() => {
            toggleUserActiveState(data.id)
                .then((res) => {
                    if (res.error) toast.error(res.error);
                    if (res.success) toast.success(res.success);
                });
        });
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem>Modifier</DropdownMenuItem> */}
          <DropdownMenuItem onClick={onToggleActive} disabled={isPending}>
            {data.isActive 
                ? <><UserX className="mr-2 h-4 w-4 text-destructive"/>Désactiver</>
                : <><UserCheck className="mr-2 h-4 w-4 text-emerald-500"/>Réactiver</>
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};