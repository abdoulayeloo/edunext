
import { z } from "zod";

// ...
export const SettingsSchema = z.object({
    name: z.string().min(1, "Le nom est requis."),
    email: z.string().email(),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        // Si un nouveau mot de passe est fourni, l'ancien est obligatoire.
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "L'ancien mot de passe est requis pour en définir un nouveau.",
        path: ["password"], // Erreur attachée au champ de l'ancien mot de passe
    })
    .refine((data) => {
        // Si l'ancien mot de passe est fourni, le nouveau est obligatoire.
        if (data.password && !data.newPassword) {
            return false;
        }
        return true;
    }, {
        message: "Le nouveau mot de passe est requis.",
        path: ["newPassword"],
    });