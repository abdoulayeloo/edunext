// src/app/admin/users/_components/cell-action.tsx
"use client";

import { User } from "@prisma/client";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteUser } from "@/actions/user";

interface CellActionProps { data: User; }

export const CellAction = ({ data }: CellActionProps) => {
    const [isPending, startTransition] = useTransition();
    // TODO: Implémenter la logique de suppression avec une modale de confirmation
    const onDeleteConfirm = () => {
        startTransition(() => {
            deleteUser(data.id)
                .then((res) => {
                    if (res.error) toast.error(res.error);
                    if (res.success) toast.success(res.success);
                });
        });
    }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem>Modifier</DropdownMenuItem> */}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4"/>Supprimer</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>{`Cette action est irréversible et supprimera l'utilisateur ${data.name} de manière permanente.`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteConfirm} disabled={isPending}>{isPending ? "Suppression..." : "Confirmer"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};