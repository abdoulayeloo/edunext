// src/schemas/index.ts
import { DiplomaLevel, Role } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Une adresse email valide est requise." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Une adresse email valide est requise." }),
  password: z.string().min(6, { message: "Minimum 6 caractères requis." }),
  name: z.string().min(1, { message: "Le nom est requis." }),
  role: z.nativeEnum(Role),
});

/**
 * Schéma pour la modification du mot de passe.
 */
export const NewPasswordSchema = z.object({

  password: z.string().min(6, {
    message: "6 caractères minimum sont requis pour le mot de passe.",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Une adresse email valide est requise.",
  }),
});

// Schéma pour la création/mise à jour d'une Formation
export const FormationSchema = z.object({
  id: z.string().optional(), // id est optionnel, car il n'existe pas à la création
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  diplomaLevel: z.nativeEnum(DiplomaLevel),
});

// Schéma pour la création/mise à jour d'une Unité d'Enseignement (UE)
export const UESchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  totalCredits: z.coerce.number().min(0, { message: "Les crédits doivent être un nombre positif." }),
  semesterId: z.string(), // On doit savoir à quel semestre l'UE appartient
  ecs: z.array(z.object({
    id: z.string(),
    name: z.string(),
    credits: z.coerce.number(),
  })),
});

// Schéma pour la création/mise à jour d'un Élément Constitutif (EC)
export const ECSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  credits: z.coerce.number().min(0, { message: "Les crédits doivent être un nombre positif." }),
  ueId: z.string(), // On doit savoir à quelle UE l'EC appartient
  professorId: z.string().optional(), // Le professeur est optionnel
});