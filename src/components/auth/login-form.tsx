// src/components/auth/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";

import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/auth/login"; // Nous créerons cette action juste après
import Image from "next/image";
import Link from "next/link";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");

    startTransition(() => {
      login(values).then((data) => {
        if (data?.success) {
          setSuccess(data.success);
        }
        if (data?.error) {
          setError(data.error);
        }
        // La redirection est gérée par le middleware, donc pas besoin ici
      });
    });
  };

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <div className="flex flex-row items-center justify-center gap-2.5">
          <Image src="/edunext.png" alt="Logo" width={50} height={50} />
          {/* <h1 className="text-3xl font-bold">EduNext</h1> */}
        </div>
        <div className="flex flex-col items-center gap-2.5 mt-6">
          <h3 className="text-lg font-semibold tracking-widest">Bienvenue</h3>
          <p className="text-gray-600">Connectez-vous pour continuer</p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Champ Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="mademba@exemple.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champ Mot de passe */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between">
                    <FormLabel>Mot de passe</FormLabel>
                    <Link href="/forgot-password">
                      <p className="text-sm text-gray-600">
                        Mot de passe oublie?
                      </p>
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Affichage de l'erreur */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          Pas encore de compte ?{" "}
          <a href="/inscription" className="underline">
            Inscrivez-vous
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
