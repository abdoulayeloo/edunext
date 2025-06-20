// src/app/(app)/admin/academic-years/_components/academic-year-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { AcademicYear } from "@prisma/client";

import { cn } from "@/lib/utils";
import { AcademicYearSchema } from "@/schemas/academic-year";
import { createAcademicYear, updateAcademicYear } from "@/actions/academic-year";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface AcademicYearFormProps {
  initialData?: AcademicYear | null;
  onClose: () => void;
}

export const AcademicYearForm = ({ initialData, onClose }: AcademicYearFormProps) => {
    const [isPending, startTransition] = useTransition();

    const formTitle = initialData ? "Modifier l'année académique" : "Créer une nouvelle année académique";
    const actionLabel = initialData ? "Enregistrer" : "Créer";

    const form = useForm<z.infer<typeof AcademicYearSchema>>({
        resolver: zodResolver(AcademicYearSchema),
        defaultValues: {
            startDate: initialData?.startDate || undefined,
            endDate: initialData?.endDate || undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof AcademicYearSchema>) => {
        startTransition(() => {
            const action = initialData ? updateAcademicYear({ ...values, id: initialData.id }) : createAcademicYear(values);

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date de début</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Choisissez une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date de fin</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Choisissez une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
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