// src/app/(app)/enseignant/_components/absence-manager.tsx
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleAbsence } from "@/actions/absence";

// Type pour les étudiants passés en props
type StudentWithProfile = {
    id: string;
    name: string | null;
    email: string | null;
    studentProfileId: string;
}

interface AbsenceManagerProps {
    courseId: string;
    students: StudentWithProfile[];
    initialAbsences: string[]; // IDs des étudiants absents pour la date d'aujourd'hui
}

export const AbsenceManager = ({ courseId, students, initialAbsences }: AbsenceManagerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [absentStudents, setAbsentStudents] = useState<Set<string>>(new Set(initialAbsences));
    const [isPending, startTransition] = useTransition();

    const handleAbsenceToggle = (studentId: string) => {
        // La date utilisée est celle sélectionnée, mais à l'heure actuelle pour l'enregistrement
        const absenceDate = new Date();
        absenceDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        startTransition(() => {
            toggleAbsence(studentId, courseId, absenceDate).then(data => {
                if (data.error) toast.error(data.error);
                if (data.success) {
                    toast.success(data.success);
                    // Mettre à jour l'état local pour un retour visuel instantané
                    const newAbsences = new Set(absentStudents);
                    if (newAbsences.has(studentId)) {
                        newAbsences.delete(studentId);
                    } else {
                        newAbsences.add(studentId);
                    }
                    setAbsentStudents(newAbsences);
                }
            })
        })
    }
    
    // TODO: Ajouter une logique pour re-fetcher les absences quand la date change

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    className="rounded-md border"
                    locale={fr}
                />
            </div>
            <div className="md:col-span-2">
                <h4 className="font-semibold mb-4">
                    Appel pour le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                </h4>
                <div className="space-y-4">
                    {students.map(student => (
                        <div key={student.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={student.id}
                                checked={absentStudents.has(student.studentProfileId)}
                                onCheckedChange={() => handleAbsenceToggle(student.studentProfileId)}
                                disabled={isPending}
                            />
                            <label htmlFor={student.id} className="text-sm font-medium leading-none">
                                {student.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}