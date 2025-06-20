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

export const sendWelcomeEmail = async (email: string, name: string, temporaryPassword: string) => {
  const loginLink = `${domain}/connexion`;

  await resend.emails.send({
    from: "EduNext <onboarding@resend.dev>",
    to: email,
    subject: "Bienvenue sur EduNext ! Votre compte a été créé.",
    html: `
      <h1>Bienvenue, ${name} !</h1>
      <p>Votre candidature a été acceptée et votre compte étudiant a été créé.</p>
      <p>Voici vos identifiants de connexion :</p>
      <ul>
        <li><strong>Email :</strong> ${email}</li>
        <li><strong>Mot de passe temporaire :</strong> ${temporaryPassword}</li>
      </ul>
      <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
      <a href="${loginLink}">Se connecter à la plateforme</a>
    `,
  });
};