// src/components/navigation/header.tsx
// import { UserButton } from "@/components/auth/user-button";
import { MobileSidebar } from "./mobile-sidebar";

export const Header = () => {
    return (
        <header className="flex items-center p-4 h-16 border-b bg-background">
            {/* Déclencheur du menu mobile, ne s'affiche que sur petits écrans */}
            <MobileSidebar />

            {/* Espace pour d'autres éléments comme un fil d'ariane ou une barre de recherche
            <div className="flex w-full justify-end">
                <UserButton />
            </div> */}
        </header>
    );
};