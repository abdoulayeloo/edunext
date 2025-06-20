// src/schemas/preregistration.ts
import * as z from "zod";

export const PreRegistrationSchema = z.object({
  lastName: z.string().min(2, "Le nom est requis."),
  firstName: z.string().min(2, "Le prénom est requis."),
  dateOfBirth: z.date({ required_error: "La date de naissance est requise." }),
  placeOfBirth: z.string().min(2, "Le lieu de naissance est requis."),
  nationality: z.string().min(2, "La nationalité est requise."),
  gender: z.string(),
  address: z.string().min(5, "L'adresse est requise."),
  city: z.string().min(2, "La ville est requise."),
  country: z.string().min(2, "Le pays est requis."),
  phone: z.string().min(9, "Le numéro de téléphone est requis."),
  email: z.string().email("L'email n'est pas valide."),
  desiredProgramId: z.string().min(1, "Veuillez sélectionner un programme."),
  entryYear: z.string().min(4, "L'année d'entrée est requise."),
  examCenter: z.string().min(2, "Le centre d'examen est requis."),
  financierLastName: z.string().min(2, "Le nom du responsable est requis."),
  financierFirstName: z.string().min(2, "Le prénom du responsable est requis."),
  financierAddress: z.string().min(5, "L'adresse du responsable est requise."),
  financierPhone: z.string().min(9, "Le téléphone du responsable est requis."),
  financierEmail: z.string().email("L'email du responsable n'est pas valide."),
  howDidYouHear: z.string().optional(),
});