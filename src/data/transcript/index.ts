// src/data/transcript.ts
"use server";

import { getStudentDashboardData } from "@/actions/students";


/**
 * Récupère toutes les données nécessaires pour un relevé de notes.
 * Cette fonction agit comme un wrapper autour de getStudentDashboardData
 * pour s'assurer que nous avons toutes les informations.
 * @param userId L'ID de l'utilisateur étudiant
 */
export const getTranscriptData = async (userId: string) => {
    try {
        const data = await getStudentDashboardData(userId);

        if (!data) {
            throw new Error("Impossible de récupérer les données pour le relevé de notes.");
        }

        return data;
    } catch (error) {
        console.error("Erreur de récupération des données du relevé:", error);
        return null;
    }
};