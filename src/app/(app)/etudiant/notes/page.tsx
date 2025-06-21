// src/app/(app)/etudiant/notes/page.tsx
import { getStudentDashboardData } from "@/data/student";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotesClient } from "./_components/notes-client";

const DetailedNotesPage = async () => {
  const session = await auth();
  // On s'assure que la session et l'ID existent
  if (!session?.user?.id) return redirect("/");

  const data = await getStudentDashboardData(session.user.id);
  if (!data?.fullFormationData)
    return <p className="p-6">Aucune donnée de formation trouvée.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Relevé de Notes Détaillé</h1>
      <NotesClient formation={data.fullFormationData} />
    </div>
  );
};

export default DetailedNotesPage;
