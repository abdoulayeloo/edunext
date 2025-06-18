// src/app/admin/formations/_components/formation-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Formation, DiplomaLevel } from "@prisma/client";

import { FormationSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createFormation } from "@/actions/formations/create-formation";
import { updateFormation } from "@/actions/formations/update-formation";

interface FormationFormProps {
  initialData?: Formation | null;
  onClose: () => void; // Fonction pour fermer la modale après soumission
}

export const FormationForm = ({ initialData, onClose }: FormationFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormationSchema>>({
    resolver: zodResolver(FormationSchema),
    defaultValues: {
      name: initialData?.name || "",
      diplomaLevel: initialData?.diplomaLevel || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof FormationSchema>) => {
    startTransition(() => {
      if (initialData) {
        // Mode mise à jour
        updateFormation({ ...values, id: initialData.id })
          .then((data) => {
            if (data.error) toast.error(data.error);
            if (data.success) {
              toast.success(data.success);
              onClose();
            }
          })
          .catch(() => toast.error("Une erreur est survenue."));
      } else {
        // Mode création
        createFormation(values)
          .then((data) => {
            if (data.error) toast.error(data.error);
            if (data.success) {
              toast.success(data.success);
              onClose();
            }
          })
          .catch(() => toast.error("Une erreur est survenue."));
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la formation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Licence 3 - Droit des Affaires"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diplomaLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau de diplôme</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un niveau" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(DiplomaLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {initialData ? "Enregistrer les modifications" : "Créer la formation"}
        </Button>
      </form>
    </Form>
  );
};
