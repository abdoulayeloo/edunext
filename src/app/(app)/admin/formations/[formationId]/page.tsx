// src/app/admin/formations/[formationId]/page.tsx
import { getFormationById } from "@/actions/formations/get-formations";
import { getEnrolledStudentsByFormation, getStudentsNotInFormation } from "@/data/enrollement/index";
import { redirect } from "next/navigation";
import { FormationStructureClient } from "./_components/formation-structure-client";
import { Toaster } from "sonner";
import { EnrollmentClient } from "./_components/enrollment-client";
import { getProfessors } from "@/data/user";

// ...

const FormationIdPage = async ({ params }: { params: { formationId: string }}) => {
  const [formation, professors, enrolledStudents, availableStudents] = await Promise.all([
    getFormationById(params.formationId),
    getProfessors(),
    getEnrolledStudentsByFormation(params.formationId),
    getStudentsNotInFormation(params.formationId),
  ]);

  if (!formation) {
    return redirect("/admin/formations");
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-between">
        {/* ... (Titre de la page) ... */}
      </div>
      <hr />
      {/* Module de gestion de la structure */}
      <FormationStructureClient formation={formation} professors={professors} />
      <hr />
      {/* Nouveau Module de gestion des inscriptions */}
      <EnrollmentClient 
        formationId={formation.id}
        enrolledStudents={enrolledStudents}
        availableStudents={availableStudents}
      />
    </div>
  );
};

export default FormationIdPage;