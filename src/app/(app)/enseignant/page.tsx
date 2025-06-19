// src/app/enseignant/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfessorDashboardData } from "@/actions/professors/index";
import { ProfessorDashboardClient } from "./_components/professor-dashboard-client";

const ProfessorDashboardPage = async () => {
  const session = await auth();

  // Sécurité : Vérifier si l'utilisateur est bien un professeur
  if (!session?.user || session.user.role !== "PROFESSOR") {
    return redirect("/connexion");
  }

  const dashboardData = await getProfessorDashboardData(
    session?.user?.id as string
  );
  console.log("dashboardData: ", dashboardData);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mon Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, Pr. {session.user.name}. Consultez vos cours et étudiants.
        </p>
      </div>
      <ProfessorDashboardClient data={dashboardData} />
    </div>
  );
};

export default ProfessorDashboardPage;
