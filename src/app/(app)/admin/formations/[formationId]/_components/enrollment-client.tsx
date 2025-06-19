// src/app/admin/formations/[formationId]/_components/enrollment-client.tsx
"use client";

import { useState, useTransition } from "react";
import { Student, User, Enrollment } from "@prisma/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  enrollStudentInFormation,
  unenrollStudent,
} from "@/actions/enrollement";

type EnrolledStudent = Enrollment & { student: { user: User } };

interface EnrollmentClientProps {
  formationId: string;
  enrolledStudents: EnrolledStudent[];
  availableStudents: (Student & { user: User })[];
}

export const EnrollmentClient = ({
  formationId,
  enrolledStudents,
  availableStudents,
}: EnrollmentClientProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onEnroll = (studentId: string) => {
    startTransition(() => {
      enrollStudentInFormation(studentId, formationId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
        }
      });
    });
  };

  const onUnenroll = (enrollmentId: string) => {
    startTransition(() => {
      unenrollStudent(enrollmentId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
      });
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Étudiants Inscrits ({enrolledStudents.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Inscrire un étudiant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sélectionner un étudiant à inscrire</DialogTitle>
            </DialogHeader>
            <Command>
              <CommandInput placeholder="Chercher un étudiant..." />
              <CommandList>
                <CommandEmpty>Aucun étudiant trouvé.</CommandEmpty>
                <CommandGroup>
                  {availableStudents.map((student) => (
                    <CommandItem
                      key={student.id}
                      onSelect={() => onEnroll(student.id)}
                    >
                      {student.user.name} ({student.user.email})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrolledStudents.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>{enrollment.student.user.name}</TableCell>
                <TableCell>{enrollment.student.user.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUnenroll(enrollment.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
