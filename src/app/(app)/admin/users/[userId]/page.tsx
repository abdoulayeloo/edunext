// src/app/(app)/admin/users/[userId]/page.tsx
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2, XCircle, Briefcase } from "lucide-react";

import { auth } from "@/auth";
import { getUserDetails } from "@/data/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="flex items-start">
    {Icon && <Icon className="h-5 w-5 text-muted-foreground mr-3 mt-1" />}
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-md font-semibold">{value || "-"}</div>
    </div>
  </div>
);

const UserDetailPage = async ({ params }: { params: { userId: string } }) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return redirect("/");

  const user = await getUserDetails(params.userId);
  if (!user) return redirect("/admin/users");

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center gap-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="text-3xl">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne d'informations générales */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                label="Rôle"
                value={<Badge>{user.role}</Badge>}
                icon={Briefcase}
              />
              <DetailItem
                label="Statut du Compte"
                value={
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Actif" : "Désactivé"}
                  </Badge>
                }
              />
              <DetailItem
                label="Email Vérifié"
                value={
                  user.emailVerified
                    ? format(user.emailVerified, "PPP", { locale: fr })
                    : "Non"
                }
                icon={user.emailVerified ? CheckCircle2 : XCircle}
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne des informations académiques */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations Académiques</CardTitle>
            </CardHeader>
            <CardContent>
              {user.role === "STUDENT" && user.studentProfile && (
                <div>
                  <h3 className="font-semibold mb-2">Inscriptions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {user.studentProfile.enrollments.map((e) => (
                      <li key={e.id}>
                        {e.formation.name} {" pour l'année "}
                        {e.academicYear.year}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {user.role === "PROFESSOR" && user.professorProfile && (
                <div>
                  <h3 className="font-semibold mb-2">Cours Enseignés</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {user.professorProfile.coursesTaught.map((ec) => (
                      <li key={ec.id}>
                        {ec.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({ec.ue.semester.formation.name})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {user.role === "ADMIN" && (
                <p>{"Cet utilisateur a des droits d'administration."}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
