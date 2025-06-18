// src/components/auth/user-button.tsx
"use client";

import { UserIcon } from "lucide-react";
import { LogOutIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export const UserButton = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (!session) return null; // Ne rien afficher si l'utilisateur n'est pas connecté

  const user = session.user;

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-sky-500">
                <UserIcon className="text-white" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem onClick={() => logout()}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // cache le bouton si dans /connexion
        !pathname.startsWith("/connexion") && (
          <Button onClick={() => router.push("/connexion")}>Connexion</Button>
        )
      )}
    </>
  );
};
