// src/components/forms/create-formation-form.tsx (Exemple)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormationSchema } from "@/schemas";
import { createFormation } from "@/actions/academic/create-formation";
import { useTransition } from "react";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// ... Import des composants UI

export const CreateFormationForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormationSchema>>({
    resolver: zodResolver(FormationSchema),
    // ... defaultValues
  });

  const onSubmit = (values: z.infer<typeof FormationSchema>) => {
    startTransition(() => {
      createFormation(values).then((data) => {
        if (data.error) {
          // Afficher l'erreur
          console.error(data.error);
        }
        if (data.success) {
          // Afficher le succès et/ou fermer le formulaire
          console.log(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... Champs du formulaire pour name et diplomaLevel ... */}
        <Button type="submit" disabled={isPending}>
          Créer la formation
        </Button>
      </form>
    </Form>
  );
};
