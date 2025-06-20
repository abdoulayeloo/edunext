// src/components/navigation/mobile-sidebar.tsx
"use client";

import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar"; // On réutilise la sidebar existante !

export const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Empêche les erreurs d'hydratation côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ferme le drawer à chaque changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
      <SheetTrigger asChild>
        <button className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};