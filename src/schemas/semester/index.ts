import { z } from "zod";

// Schéma pour la création/mise à jour d'un Semestre
export const SemesterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  formationId: z.string(),
});