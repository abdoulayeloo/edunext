// src/components/navigation/sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  LayoutDashboard,
  GraduationCap,
  School,
  Settings,
  LogOut,
  CalendarDays,
  Loader2,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth/logout";
import { useTransition } from "react";

// On définit les routes à l'extérieur pour une meilleure lisibilité
const commonRoutes = [
  { label: "Paramètres", href: "/settings", icon: Settings },
];

const adminRoutes = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Utilisateurs", href: "/admin/users", icon: User },
  { label: "Formations", href: "/admin/formations", icon: School },
  { label: "Années Académiques", href: "/admin/academic-years", icon: CalendarDays },
  { label: "Pré-inscriptions", href: "/admin/pre-registrations", icon: Loader2 },
];

const professorRoutes = [
  { label: "Dashboard", href: "/enseignant", icon: LayoutDashboard },
];

const studentRoutes = [
  { label: "Tableau de bord", href: "/etudiant", icon: LayoutDashboard },
  { label: "Relevé de notes", href: "/etudiant/notes", icon: GraduationCap },
  { label: "Mes Absences", href: "/etudiant/absences", icon: UserX },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
    const [isPending, startTransition] = useTransition();


  // Logique de sélection des routes, un peu plus directe
  const getRoutesForRole = () => {
    switch (userRole) {
      case "ADMIN":
        return adminRoutes;
      case "PROFESSOR":
        return professorRoutes;
      case "STUDENT":
        return studentRoutes;
      default:
        return [];
    }
  };

  

  const routes = [...getRoutesForRole(), ...commonRoutes];

  const handleLogout = () => {
    // 4. Envelopper l'appel à l'action dans startTransition
    startTransition(() => {
        logout();
    });
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-10">
          <div className="relative w-8 h-8 mr-4">
            {/* Assurez-vous que edunext.png est bien dans le dossier /public */}
            <Image
              src="/edunext.png"
              width={40}
              height={40}
              alt="Logo EduNext"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary">EduNext</h1>
        </Link>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={pathname === route.href ? "default" : "ghost"}
              className="w-full justify-start font-medium"
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4 mr-3" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="link"
          className="w-full justify-start cursor-pointer !no-underline font-medium bg-destructive/10 text-destructive"
          onClick={handleLogout}
          disabled={isPending} // Le bouton est désactivé pendant l'action
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-3 animate-spin" /> // Affiche un spinner
          ) : (
            <LogOut className="h-4 w-4 mr-3 text-destructive" /> // Affiche l'icône normale
          )}
          {isPending ? "Déconnexion..." : "Se déconnecter"}
        </Button>
      </div>
    </div>
  );
};