// src/lib/mail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "EduNext <onboarding@resend.dev>", // TODO: Utiliser un domaine vérifié en production
        to: email,
        subject: "Confirmez votre adresse email",
        html: `<p>Bonjour,</p><p>Cliquez sur le lien suivant pour vérifier votre adresse email et activer votre compte : <a href="${confirmLink}">Vérifier mon email</a></p><p>Ce lien expirera dans une heure.</p>`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/naw-password?token=${token}`;

  await resend.emails.send({
    from: "EduNext <onboarding@resend.dev>",
    to: email,
    subject: "Réinitialisez votre mot de passe",
    html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser mon mot de passe</a></p>`,
  });
};