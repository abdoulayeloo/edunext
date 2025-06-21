// src/app/(app)/enseignant/_components/appreciation-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Enrollment } from "@prisma/client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { saveAppreciation } from "@/actions/professors";

const AppreciationSchema = z.object({
  appreciation: z
    .string()
    .min(10, "L'appréciation doit contenir au moins 10 caractères."),
});

interface AppreciationFormProps {
  initialData: Enrollment;
  onClose: () => void;
}

export const AppreciationForm = ({
  initialData,
  onClose,
}: AppreciationFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof AppreciationSchema>>({
    resolver: zodResolver(AppreciationSchema),
    defaultValues: { appreciation: initialData.appreciation || "" },
  });

  const onSubmit = (values: z.infer<typeof AppreciationSchema>) => {
    startTransition(() => {
      saveAppreciation(initialData.id, values.appreciation).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) {
          toast.success(data.success);
          onClose();
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="appreciation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appréciation générale</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Écrivez une appréciation sur le travail et le comportement de l'étudiant..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Enregistrement..." : "Enregistrer l'appréciation"}
        </Button>
      </form>
    </Form>
  );
};
