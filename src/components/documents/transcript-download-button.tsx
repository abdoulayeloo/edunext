// src/app/(app)/etudiant/_components/download-transcript-button.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranscriptDocument } from "@/components/documents/transcript-document";

// Récupérer le type
type TranscriptData = NonNullable<Awaited<ReturnType<typeof import("@/data/transcript").getTranscriptData>>>;

interface DownloadTranscriptButtonProps {
    data: TranscriptData;
}

export const DownloadTranscriptButton = ({ data }: DownloadTranscriptButtonProps) => {
    // Le composant ne s'affiche que sur le client
    if (typeof window === "undefined") {
        return <Button disabled>Chargement...</Button>;
    }

    const fileName = `releve-notes-${data.formation?.name?.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    
    return (
        <PDFDownloadLink
            // --- LA CORRECTION EST ICI ---
            // On passe un seul prop 'data' qui contient tout
            document={<TranscriptDocument data={data} />}
            fileName={fileName}
        >
            {({ loading }) => (
                <Button disabled={loading} size="lg">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Génération du PDF...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4"/>
                            Télécharger mon Relevé Complet
                        </>
                    )}
                </Button>
            )}
        </PDFDownloadLink>
    );
};