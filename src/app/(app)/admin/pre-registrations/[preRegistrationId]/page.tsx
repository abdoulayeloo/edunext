// src/app/(app)/admin/pre-registrations/[id]/page.tsx
import { getPreRegistrationById } from "@/data/preregistration";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApprovalActions } from "./_components/approval-actions";

interface Params {
  params: { preRegistrationId: string };
}
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-md font-semibold">{value || "-"}</p>
  </div>
);

const ApplicationDetailPage = async ({ params }: Params) => {
  const application = await getPreRegistrationById(params.preRegistrationId);

  if (!application) {
    return redirect("/admin/pre-registrations");
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "default";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Candidature de {application.firstName} {application.lastName}
          </h1>
          <div className="flex items-center gap-x-2 mt-2">
            <p className="text-sm text-muted-foreground">
              Soumis le{" "}
              {format(application.createdAt, "d MMMM yyyy", { locale: fr })}
            </p>
            <Badge variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>
          </div>
        </div>
        <ApprovalActions application={application} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>État Civil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Nom complet"
              value={`${application.firstName} ${application.lastName}`}
            />
            <DetailItem
              label="Date de naissance"
              value={format(application.dateOfBirth, "PPP", { locale: fr })}
            />
            <DetailItem
              label="Lieu de naissance"
              value={application.placeOfBirth}
            />
            <DetailItem label="Nationalité" value={application.nationality} />
            <DetailItem label="Sexe" value={application.gender} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact et Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Email" value={application.email} />
            <DetailItem label="Téléphone" value={application.phone} />
            <DetailItem label="Adresse" value={application.address} />
            <DetailItem
              label="Ville / Pays"
              value={`${application.city}, ${application.country}`}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Programme de Candidature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Formation souhaitée"
              value={application.desiredProgram.name}
            />
            <DetailItem
              label="Année d'entrée visée"
              value={application.entryYear}
            />
            <DetailItem
              label="Centre d'examen"
              value={application.examCenter}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Responsable Financier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Nom complet"
              value={`${application.financierFirstName} ${application.financierLastName}`}
            />
            <DetailItem label="Email" value={application.financierEmail} />
            <DetailItem label="Téléphone" value={application.financierPhone} />
            <DetailItem label="Adresse" value={application.financierAddress} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
