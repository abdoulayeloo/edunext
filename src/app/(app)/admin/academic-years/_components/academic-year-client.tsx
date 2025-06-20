// src/app/(app)/admin/academic-years/_components/academic-years-client.tsx
"use client";

import { AcademicYear } from "@prisma/client";
import { Plus } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";

interface AcademicYearsClientProps {
  academicYears: AcademicYear[];
}

export const AcademicYearsClient = ({
  academicYears,
}: AcademicYearsClientProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const handleRowClick = (academicYearId: string) => {
    router.push(`/admin/academic-years/${academicYearId}`);
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Années Académiques ({academicYears.length})
        </h1>
        <Button onClick={() => onOpen("createAcademicYear")}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une année
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={academicYears}
        onRowClick={handleRowClick}
      />
    </>
  );
};
