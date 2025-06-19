// src/components/navigation/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  LayoutDashboard,
  GraduationCap,
  School,
  Settings,
  LogOut,
} from "lucide-react";

// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logout } from "@/actions/auth/logout";

const commonRoutes = [
  { label: "Paramètres", href: "/settings", icon: Settings },
];

const adminRoutes = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Utilisateurs", href: "/admin/users", icon: User },
  { label: "Formations", href: "/admin/formations", icon: School },
];

const professorRoutes = [
  { label: "Dashboard", href: "/enseignant", icon: LayoutDashboard },
];

const studentRoutes = [
  { label: "Mes Résultats", href: "/etudiant", icon: GraduationCap },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  let routes = commonRoutes;
  if (userRole === "ADMIN") {
    routes = [...adminRoutes, ...commonRoutes];
  } else if (userRole === "PROFESSOR") {
    routes = [...professorRoutes, ...commonRoutes];
  } else if (userRole === "STUDENT") {
    routes = [...studentRoutes, ...commonRoutes];
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white shadow-md">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-10">
          <div className="relative w-8 h-8 mr-4">
            <Image
              src="/edunext.png"
              width={32}
              height={32}
              alt="Edunext"
            />
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={pathname === route.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4 mr-2" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          asChild
          variant="destructive"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <Link href="/connexion">
            <LogOut className="h-4 w-4 mr-2" />
            Deconnexion
          </Link>
        </Button>
      </div>
    </div>
  );
};
