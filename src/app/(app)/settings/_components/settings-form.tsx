// src/app/(app)/settings/_components/settings-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react"; // On garde 'update' de useSession
import { toast } from "sonner";

import { SettingsSchema } from "@/schemas/settings";
import { updateSettings } from "@/actions/settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "next-auth"; // On importe le type User
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

// On définit les props que le composant attend
interface SettingsFormProps {
  user?: User;
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
  // Le hook 'update' est utile pour rafraîchir la session après une modification
  const { update } = useSession();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // On utilise les données de la prop 'user' pour les valeurs par défaut
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      newPassword: "",
    },
  });

  // La propriété `isOAuth` est maintenant calculée à partir de la prop
  // Note: Nous devons ajouter `hashedPassword` au type de la session pour y accéder
  // Pour l'instant, nous le laissons optionnel.
  //   const isOAuth = !user?.hashedPassword;

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      updateSettings(values)
        .then((data) => {
          if (data.error) setError(data.error);
          if (data.success) {
            // On appelle update() pour que le nom change dans toute l'app
            update();
            setSuccess(data.success);
            toast.success("Profil mis à jour !");
          }
        })
        .catch(() => setError("Une erreur est survenue."));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... Le JSX du formulaire reste le même ... */}
        {/* Exemple pour le champ Nom */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={field.value} readOnly disabled={true} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancien mot de passe</FormLabel>
              <FormControl>
                <Input {...field} type="password" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input {...field} type="password" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Sauvegarde..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};
