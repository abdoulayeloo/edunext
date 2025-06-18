// src/app/admin/formations/[formationId]/_components/ue-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { UE } from "@prisma/client";

import { UESchema } from "@/schemas";
import { createUE, updateUE } from "@/actions/UEs/index";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UEFormProps {
  semesterId: string;
  initialData?: UE | null;
  onClose: () => void;
}

export const UEForm = ({ semesterId, initialData, onClose }: UEFormProps) => {
  const [isPending, startTransition] = useTransition();

  const formTitle = initialData ? "Modifier l'UE" : "Créer une nouvelle UE";
  const actionLabel = initialData ? "Enregistrer" : "Créer";

  const form = useForm<z.infer<typeof UESchema>>({
    resolver: zodResolver(UESchema),
    defaultValues: {
      name: initialData?.name || "",
      totalCredits: initialData?.totalCredits || 0,
      semesterId: semesterId,
    },
  });

  const onSubmit = (values: z.infer<typeof UESchema>) => {
    startTransition(() => {
      const action = initialData
        ? updateUE({ ...values, id: initialData.id })
        : createUE(values);

      action.then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) {
          toast.success(data.success);
          onClose();
        }
      }).catch(() => toast.error("Une erreur est survenue."));
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{formTitle}</h3>
      <Form {...form}>
        <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Nom de l'UE"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: UEF 3.1: Algorithmique" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crédits ECTS</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Ex: 12" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Enregistrement..." : actionLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
};