// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Users, Library, Activity } from "lucide-react";

import { getAuditLogs } from "@/data/audit-log/index";
import { AuditLogItem } from "@/components/admin/audit-log-item";

import { auth } from "@/auth";
import { getUsersCount, getFormationsCount } from "@/actions/admin/admin-stats";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboardPage = async () => {
  // Récupération des logs
  const logs = await getAuditLogs();

  // 1. Vérification des droits côté serveur (défense en profondeur)
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    // Cette redirection est une sécurité supplémentaire, le middleware fait déjà le travail.
    return redirect("/admin");
  }

  // 2. Récupération des données
  const usersCount = await getUsersCount();
  const formationsCount = await getFormationsCount();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>

      {/* Section des Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Étudiants Inscrits"
          value={usersCount.students}
          icon={Users}
        />
        <StatCard
          title="Professeurs"
          value={usersCount.professors}
          icon={GraduationCap}
        />
        <StatCard
          title="Formations Actives"
          value={formationsCount}
          icon={Library}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Section des Raccourcis */}
        <Card>
          <CardHeader>
            <CardTitle>Accès Rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button asChild variant="outline">
              <Link href="/admin/users">Gérer les Utilisateurs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/formations">Gérer les Formations</Link>
            </Button>
            {/* Ajoutez d'autres raccourcis ici */}
          </CardContent>
        </Card>

        {/* Section de l'Activité Récente (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <ul className="space-y-4">
                {logs.map((log) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune activité récente.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
