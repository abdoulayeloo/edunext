// src/components/auth/new-verification-form.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/actions/auth/new-verification";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token manquant !");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Une erreur est survenue !");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Vérification de votre email</p>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {!success && !error && <BeatLoader />}
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </CardContent>
      <CardFooter>
          <Button asChild variant="link" className="w-full">
              <Link href="/connexion">
                Retour à la connexion
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
};