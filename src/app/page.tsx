// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(status)

  useEffect(() => {
    // Ne rien faire tant que le statut de la session est en cours de chargement
    if (status === "loading") {
      return;
    }

    // Démarrer un minuteur de 3 secondes
    const timer = setTimeout(() => {
      if (status === "authenticated") {
        // L'utilisateur est connecté, on le redirige en fonction de son rôle
        const userRole = session?.user?.role;
        console.log(userRole)
        switch (userRole) {
          case "ADMIN":
            router.push("/admin");
            break;
          case "PROFESSOR":
            router.push("/enseignant");
            break;
          case "STUDENT":
            router.push("/etudiant");
            break;
          default:
            router.push("/connexion"); // Redirection par défaut si le rôle est inconnu
            break;
        }
      } else {
        // L'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        router.push("/connexion");
      }
    }, 5000); // Délai de 3000 millisecondes (3 secondes)

    // Nettoyer le minuteur si le composant est démonté avant la fin du délai
    return () => clearTimeout(timer);
  }, [status, session, router]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-sky-50">
      <div>
        <Image src={'/edunext.png'} alt="Logo" width={50} height={50} />
        <PulseLoader color="#0284c7" size={15} />
      </div>
    </main>
  );
};

export default HomePage;
