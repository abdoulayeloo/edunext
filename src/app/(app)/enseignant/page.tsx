// src/app/(app)/enseignant/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfessorDashboardData } from "@/data/professor";
import { getVisibleAnnouncements } from "@/data/announcement"; // <-- 1. Importer la fonction de récupération des annonces
import { ProfessorDashboardClient } from "./_components/professor-dashboard-client";
import { AnnouncementsList } from "@/components/shared/announcements-list"; // <-- 2. Importer le composant d'affichage

const ProfessorDashboardPage = async () => {
  const session = await auth();

  // Sécurité : Vérifier si l'utilisateur est bien un professeur
  if (!session?.user || session.user.role !== "PROFESSOR") {
    return redirect("/");
  }

  // 3. Récupérer les données du dashboard et les annonces en parallèle pour plus d'efficacité
  const [dashboardData, announcements] = await Promise.all([
    getProfessorDashboardData(session.user.id as string),
    getVisibleAnnouncements()
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mon Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, {session.user.name}. Consultez vos cours et les dernières nouvelles.
        </p>
      </div>
      {/* 4. Afficher le composant des annonces */}
      <AnnouncementsList announcements={announcements} />
      {/* Le reste du tableau de bord (liste des cours, notes, etc.) */}
      <ProfessorDashboardClient data={dashboardData} />
    </div>
  );
};

export default ProfessorDashboardPage;