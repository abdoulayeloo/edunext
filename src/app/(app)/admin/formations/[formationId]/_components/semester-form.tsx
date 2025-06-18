// src/app/admin/formations/[formationId]/_components/semester-form.tsx
"use client";
import * as z from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Semester } from "@prisma/client";
import { SemesterSchema } from "@/schemas/semester";
import { createSemester } from "@/actions/semesters/index";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// ... import des composants UI (Form, Input, Button, etc.)

interface SemesterFormProps {
  formationId: string;
  initialData?: Semester | null;
  onClose: () => void;
}

export const SemesterForm = ({
  formationId,
  initialData,
  onClose,
}: SemesterFormProps) => {
  const [isPending, startTransition] = useTransition();
  // ... Logique du formulaire (similaire à FormationForm)
  const form = useForm<z.infer<typeof SemesterSchema>>({
    resolver: zodResolver(SemesterSchema),
    defaultValues: { name: initialData?.name || "", formationId: formationId },
  });

  const onSubmit = (values: z.infer<typeof SemesterSchema>) => {
    startTransition(() => {
      // TODO: Ajouter la logique de mise à jour si initialData existe
      createSemester(values).then((res) => {
        if (res.error) toast.error(res.error);
        if (res.success) {
          toast.success(res.success);
          onClose();
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du semestre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Semestre 1"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Note : Le champ 'formationId' n'a pas besoin d'être un champ visible 
                car il est déjà inclus dans les defaultValues du formulaire. 
                Il sera automatiquement soumis avec le nom du semestre.
            */}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Création en cours..." : "Créer le semestre"}
        </Button>
      </form>
    </Form>
  );
};
