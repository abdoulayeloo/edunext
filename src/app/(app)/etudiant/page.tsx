// src/app/etudiant/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentDashboardData } from "@/actions/students/index";
import { StudentDashboardClient } from "./_components/student-dashboard-client";

const StudentDashboardPage = async () => {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return redirect("/connexion");
  }

  const dashboardData = await getStudentDashboardData(
    session.user.id as string
  );

  if (!dashboardData) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Bienvenue {session.user.name}</h1>
        <p className="text-muted-foreground">
          {`Vous n'êtes inscrit à aucune formation pour le moment.`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mes Résultats</h1>
        <p className="text-muted-foreground">
          Formation : {dashboardData.formation.name}
        </p>
      </div>
      <StudentDashboardClient formation={dashboardData.formation} />
    </div>
  );
};

export default StudentDashboardPage;
