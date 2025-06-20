// src/app/inscription/page.tsx
import { PreRegistrationForm } from "@/components/auth/preregistration-form";
import { getFormations } from "@/actions/formations/get-formations"; // Assurez-vous d'avoir cette fonction

const InscriptionPage = async () => {
    const formations = await getFormations(); // Récupérer les formations pour le dropdown

    return (
        <div className="min-h-screen bg-muted/40 py-12">
            <div className="container mx-auto max-w-4xl">
                <PreRegistrationForm formations={formations} />
            </div>
        </div>
    );
};

export default InscriptionPage;