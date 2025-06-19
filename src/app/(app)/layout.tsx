// src/app/(app)/layout.tsx
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Toaster } from "sonner"; // Pour les notifications

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="h-full relative">
        <aside className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
          <Sidebar />
        </aside>
        <main className="md:pl-64 h-full bg-muted/40">
          {/* TODO: Ajouter un Header/Navbar ici si besoin */}
          <Toaster position="top-center" richColors />
          {children}
        </main>
      </div>
    </SessionProvider>
  );
};

export default AppLayout;
