// next-auth.d.ts
import { Role } from "@prisma/client"; // Importez votre enum Role
import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  // Étend l'objet Session pour inclure le rôle
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  // Optionnel : Étend l'objet User si vous en avez besoin ailleurs
  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  // Étend le token JWT pour inclure le rôle
  interface JWT {
    role: Role;
  }
}