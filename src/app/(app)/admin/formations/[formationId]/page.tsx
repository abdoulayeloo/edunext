// src/app/admin/formations/[formationId]/page.tsx
import { getFormationById } from "@/actions/formations/get-formations";
import {
  getEnrolledStudentsByFormation,
  getStudentsNotInFormation,
} from "@/data/enrollement/index";
import { redirect } from "next/navigation";
import { FormationStructureClient } from "./_components/formation-structure-client";
import { Toaster } from "sonner";
import { EnrollmentClient } from "./_components/enrollment-client";
import { getProfessors } from "@/data/user";


interface Params {
  params: { formationId: string };
}

const FormationIdPage = async ({
  params,
}: Params) => {
  // On extrait l'ID de la formation dans une constante avant toute chose.
  const {formationId} = await params;

  // On lance les requêtes en parallèle en utilisant la constante `formationId`.
  const [formation, professors, enrolledStudents, availableStudents] =
    await Promise.all([
      getFormationById(formationId),
      getProfessors(),
      getEnrolledStudentsByFormation(formationId),
      getStudentsNotInFormation(formationId),
    ]);

  if (!formation) {
    return redirect("/admin/formations");
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{formation.name}</h1>
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
