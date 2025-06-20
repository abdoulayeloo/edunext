import { z } from "zod";

export const AcademicYearSchema = z.object({
  id: z.string().optional(), // On rend l'ID optionnel
  startDate: z.date({
    required_error: "La date de début est requise.",
  }),
  endDate: z.date({
    required_error: "La date de fin est requise.",
  }),
}).refine((data) => data.endDate > data.startDate, {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["endDate"],
});