// src/components/admin/users-table.tsx
"use client";

import { User, Role } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "sonner"; // Assurez-vous d'installer sonner: pnpm install sonner

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/actions/admin/update-user";

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  const [isPending, startTransition] = useTransition();

  const onRoleChange = (userId: string, newRole: Role) => {
    startTransition(() => {
      updateUserRole(userId, newRole)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
          }
          if (data.error) {
            toast.error(data.error);
          }
        })
        .catch(() => toast.error("Une erreur est survenue."));
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                defaultValue={user.role}
                onValueChange={(newRole) =>
                  onRoleChange(user.id, newRole as Role)
                }
                disabled={isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Changer le rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="PROFESSOR">Professeur</SelectItem>
                  <SelectItem value="STUDENT">Étudiant</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
