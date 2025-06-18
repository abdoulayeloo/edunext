// src/app/admin/formations/page.tsx
import { getFormations } from "@/actions/formations/get-formations";
import { Toaster } from "sonner";
import { FormationsClient } from "./_components/formations-client";

const FormationsPage = async () => {
  const formations = await getFormations();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Formations</h1>
      <Toaster position="top-center" richColors />
      <FormationsClient formations={formations} />
    </div>
  );
};

export default FormationsPage;