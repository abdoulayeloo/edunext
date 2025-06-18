// src/app/auth/new-verification/page.tsx
import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

const NewVerificationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Suspense est utile car le composant utilise useSearchParams */}
      <Suspense fallback={<div>Chargement...</div>}>
        <NewVerificationForm />
      </Suspense>
    </div>
  );
};

export default NewVerificationPage;