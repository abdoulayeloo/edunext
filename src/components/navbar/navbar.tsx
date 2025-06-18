// Exemple d'intégration dans une Navbar
// src/components/navbar.tsx

import { UserButton } from "@/components/auth/user-button";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <nav
      className={`${className} p-4  w-full shadow-sm flex justify-between items-center`}
    >
      <Link href="/">
        <Image src="/edunext.png" alt="Logo" width={100} height={100} />
      </Link>
      <UserButton />
    </nav>
  );
};
