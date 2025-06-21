// src/app/(app)/etudiant/_components/download-transcript-button.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranscriptDocument } from "@/components/documents/releve-note-document";
import { JSX } from "react";

// Récupérer les types
type StudentData = NonNullable<
  Awaited<ReturnType<typeof import("@/data/student").getStudentDashboardData>>
>;

interface DownloadTranscriptButtonProps {
  data: StudentData;
}

/**
 * Component that renders a button allowing students to download
 * their transcript as a PDF file. The PDF file is generated using
 * the student's full formation data and name. The button displays
 * a loading animation while the PDF is being generated.
 *
 * @param {DownloadTranscriptButtonProps} props - The props for the component.
 * @param {StudentData} props.data - The student data containing the user's name
 * and full formation data required for generating the transcript.
 * @returns {JSX.Element | null} A JSX element for the download button or null
 * if the formation data is not available.
 */

export const DownloadTranscriptButton = ({
  data,
}: DownloadTranscriptButtonProps): JSX.Element | null => {
  if (!data.fullFormationData) return null;

  // Nom du fichier PDF généré
  const fileName = `releve-notes-${data.user?.name?.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <TranscriptDocument
          studentName={data.user?.name}
          formation={data.fullFormationData}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Télécharger mon relevé de notes
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
