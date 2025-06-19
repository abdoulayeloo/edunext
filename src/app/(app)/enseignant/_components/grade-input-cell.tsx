// src/app/enseignant/_components/grade-input-cell.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { assignOrUpdateGrade } from "@/actions/grade/index";

// Hook simple pour le debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

interface GradeInputCellProps {
  studentId: string;
  evaluationId: string;
  initialValue?: number | null;
}

export const GradeInputCell = ({
  studentId,
  evaluationId,
  initialValue,
}: GradeInputCellProps) => {
  const [value, setValue] = useState(initialValue?.toString() || "");
  const [isPending, startTransition] = useTransition();
  const debouncedValue = useDebounce(value, 1000); // Sauvegarde 1s après la fin de la saisie

  useEffect(() => {
    // Ne pas sauvegarder si la valeur n'a pas changé ou si c'est la valeur initiale
    if (debouncedValue === (initialValue?.toString() || "")) return;

    startTransition(() => {
      const gradeValue = parseFloat(debouncedValue);
      if (isNaN(gradeValue)) return; // Ne pas sauvegarder si ce n'est pas un nombre

      assignOrUpdateGrade({
        studentId,
        evaluationId,
        value: gradeValue,
      }).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Input
        type="number"
        step="0.25"
        min="0"
        max="20"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 text-center pr-8"
        placeholder="-"
      />
      {isPending && (
        <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
