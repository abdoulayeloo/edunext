// src/app/(app)/settings/page.tsx
import { auth } from "@/auth"; // On importe la fonction 'auth'
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SettingsForm } from "./_components/settings-form"; // On importera le formulaire

const SettingsPage = async () => {
    // 1. On récupère la session côté serveur
    const session = await auth();

    // 2. Sécurité : si pas de session, on redirige (même si le middleware le fait déjà)
    if (!session || !session.user) {
        return redirect("/connexion");
    }

    // 3. On extrait l'objet 'user'
    const user = session.user;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Paramètres du Compte</h1>
            <Card className="max-w-xl">
                <CardHeader>
                    <p className="text-2xl font-semibold">Mon Profil</p>
                </CardHeader>
                <CardContent>
                    {/* 4. On passe l'objet 'user' en prop au formulaire */}
                    <SettingsForm user={user} />
                </CardContent>
            </Card>
        </div>
    );
}

export default SettingsPage;