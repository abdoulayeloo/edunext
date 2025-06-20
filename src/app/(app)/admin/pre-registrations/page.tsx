// src/app/(app)/admin/pre-registrations/page.tsx
import { getPendingPreRegistrations } from "@/data/preregistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table"; // Assurez-vous d'avoir ce composant générique
import { columns } from "./_components/columns";

const PreRegistrationsPage = async () => {
  const applications = await getPendingPreRegistrations();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidatures en Attente ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={applications} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PreRegistrationsPage;