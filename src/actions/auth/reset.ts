// src/actions/reset.ts
"use server";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const ResetSchema = z.object({ email: z.string().email() });

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Email invalide." };
    const { email } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return { error: "Aucun utilisateur trouvé avec cet email." };

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Email de réinitialisation envoyé !" };
};