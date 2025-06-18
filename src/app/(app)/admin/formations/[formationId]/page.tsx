// src/app/admin/formations/[formationId]/page.tsx
import { getFormationById } from "@/actions/formations/get-formations";
// import { getProfessors } from "@/data/user"; // Importez la nouvelle fonction
import { redirect } from "next/navigation";
import { FormationStructureClient } from "./_components/formation-structure-client";
import { Toaster } from "sonner";

// ... (interface FormationIdPageProps)

const FormationIdPage = async ({ params }: { params: { formationId: string }}) => {
  // On lance les deux requêtes en parallèle pour plus d'efficacité
  const [formation ] = await Promise.all([
    getFormationById(params.formationId),
    // getProfessors(),
  ]);

  if (!formation) {
    return redirect("/admin/formations");
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{formation.name}</h1>
          <p className="text-sm text-muted-foreground">
            Structure pédagogique de la formation
          </p>
        </div>
      </div>
      <hr className="my-6" />
      {/* On passe la liste des professeurs au composant client */}
      <FormationStructureClient formation={formation} />
    </div>
  );
};

export default FormationIdPage;