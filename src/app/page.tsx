// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CircleLoader} from "react-spinners";

// Mapping des rôles et de leurs pages d'accueil
const roleHomePages: Record<string, string> = {
  ADMIN: "/admin",
  PROFESSOR: "/enseignant",
  STUDENT: "/etudiant",
};

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Ne rien faire tant qu'on ne connaît pas le statut de la session
    if (status === "loading") {
      return;
    }

    if (status === "authenticated") {
      // L'utilisateur est connecté. On le redirige vers sa page.
      const userRole = session?.user?.role;
      const homePage = userRole ? roleHomePages[userRole] : "/connexion";
      router.push(homePage);
    } else {
      // L'utilisateur n'est pas connecté.
      router.push("/connexion");
    }
  }, [status, session, router]);

  // Pendant que useEffect travaille en arrière-plan, on affiche toujours le loader.
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-sky-50">
      <div>
        <CircleLoader  color="#0284c7" size={50} />
      </div>
    </main>
  );
};

export default HomePage;