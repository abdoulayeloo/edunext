// src/app/admin/formations/[formationId]/_components/semester-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Semester } from "@prisma/client";

import { SemesterSchema } from "@/schemas/semester";
import { createSemester, updateSemester } from "@/actions/semesters";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SemesterFormProps {
  formationId: string;
  initialData?: Semester | null;
  onClose: () => void;
}

export const SemesterForm = ({ formationId, initialData, onClose }: SemesterFormProps) => {
    const [isPending, startTransition] = useTransition();

    const formTitle = initialData ? "Modifier le semestre" : "Créer un nouveau semestre";
    const actionLabel = initialData ? "Enregistrer" : "Créer";

    const form = useForm<z.infer<typeof SemesterSchema>>({
        resolver: zodResolver(SemesterSchema),
        defaultValues: {
            name: initialData?.name || "",
            formationId: formationId,
        }
    });

    const onSubmit = (values: z.infer<typeof SemesterSchema>) => {
        startTransition(() => {
            const action = initialData ? updateSemester({ ...values, id: initialData.id }) : createSemester(values);
            action.then(res => {
                if (res.error) toast.error(res.error);
                if (res.success) {
                    toast.success(res.success);
                    onClose();
                }
            }).catch(() => toast.error("Une erreur est survenue."));
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
                                <FormLabel>Nom du semestre</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: Semestre 1" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Enregistrement..." : actionLabel}
                    </Button>
                </form>
            </Form>
        </div>
    );
};