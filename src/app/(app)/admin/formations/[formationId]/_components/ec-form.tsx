// src/app/admin/formations/[formationId]/_components/ec-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { EC, User } from "@prisma/client";

import { ECSchema } from "@/schemas";
import { createEC, updateEC } from "@/actions/ECs/index";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ECFormProps {
  ueId: string;
  professors: User[]; // La liste des professeurs à afficher dans le dropdown
  initialData?: EC | null;
  onClose: () => void;
}

export const ECForm = ({
  ueId,
  professors,
  initialData,
  onClose,
}: ECFormProps) => {
  const [isPending, startTransition] = useTransition();

  const formTitle = initialData ? "Modifier l'EC" : "Créer un nouvel EC";
  const actionLabel = initialData ? "Enregistrer" : "Créer";

  const form = useForm<z.infer<typeof ECSchema>>({
    resolver: zodResolver(ECSchema),
    defaultValues: {
      name: initialData?.name || "",
      credits: initialData?.credits || 0,
      professorId: initialData?.professorId || undefined,
      ueId: ueId,
    },
  });

  /**
   * Submit the form, either creating a new EC or updating an existing one
   * depending on the value of `initialData`.
   *
   * @param values - The form values as validated by `ECSchema`.
   */
  const onSubmit = (values: z.infer<typeof ECSchema>) => {
    startTransition(() => {
      const action = initialData
        ? updateEC({ ...values, id: initialData.id })
        : createEC(values);
      action
        .then((data) => {
          if (data.error) toast.error(data.error);
          if (data.success) {
            toast.success(data.success);
            onClose();
          }
        })
        .catch(() => toast.error("Une erreur est survenue."));
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{formTitle}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Nom de l'EC"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Algorithmique 1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crédits ECTS</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Ex: 6"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="professorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professeur Assigné (Optionnel)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un professeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professors.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="reset" className="w-full" disabled={isPending}>
            {isPending ? "Enregistrement..." : actionLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
};
