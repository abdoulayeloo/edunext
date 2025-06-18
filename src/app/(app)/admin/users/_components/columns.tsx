// src/app/admin/users/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/actions/admin/update-user";
import { toast } from "sonner";
// Importez CellAction que nous allons créer
import { CellAction } from "./cell-action";

export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Select
          defaultValue={user.role}
          onValueChange={(newRole) => {
            toast.promise(updateUserRole(user.id, newRole as Role), {
                loading: 'Mise à jour du rôle...',
                success: (data) => data.success || "Rôle mis à jour!",
                error: (data) => data.error || "Une erreur est survenue.",
            });
          }}
        >
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];