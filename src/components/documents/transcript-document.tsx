// src/components/documents/transcript-document.tsx
"use client";

import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';

// Type pour les données (on le récupère depuis notre fonction de données)
type TranscriptData = NonNullable<Awaited<ReturnType<typeof import("@/data/transcript").getTranscriptData>>>;

interface TranscriptDocumentProps {
  data: TranscriptData;
}

// Définition des styles (similaire à du CSS-in-JS)
const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
    header: { textAlign: 'center', marginBottom: 20 },
    schoolName: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
    title: { fontSize: 14, textDecoration: 'underline', marginTop: 4 },
    studentInfoSection: { border: '1px solid #eee', padding: 10, marginBottom: 20, lineHeight: 1.5 },
    studentInfoText: { fontSize: 11 },
    semesterCard: { marginBottom: 15, border: '1px solid #ccc', padding: 10, borderRadius: 5 },
    semesterTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10, backgroundColor: '#f0f0f0', padding: 5, borderRadius: 3 },
    ueTable: { display: "flex", width: "auto", marginBottom: 10 },
    ueHeader: { flexDirection: 'row', backgroundColor: '#e8e8e8', borderBottom: '1px solid #333' },
    ueHeaderText: { padding: 4, fontFamily: 'Helvetica-Bold', fontSize: 9 },
    ueRow: { flexDirection: 'row', borderBottom: '1px solid #eee' },
    ueCell: { padding: 4, fontSize: 10 },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: 'grey' },
});

export const TranscriptDocument = ({ data }: TranscriptDocumentProps) => {
    
  const { user, fullFormationData } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* En-tête */}
        <View style={styles.header}>
            {/* Si vous avez un logo dans /public/edunext.png */}
            {/* <Image src="/edunext.png" style={{ width: 50, height: 50, margin: 'auto' }} /> */}
            <Text style={styles.schoolName}>EduNext University</Text>
            <Text style={styles.title}>Relevé de Notes Complet</Text>
        </View>

        {/* Informations sur l'étudiant */}
        <View style={styles.studentInfoSection}>
            <Text style={styles.studentInfoText}>Nom de l'étudiant : {user?.name}</Text>
            <Text style={styles.studentInfoText}>Email : {user?.email}</Text>
            <Text style={styles.studentInfoText}>Formation : {fullFormationData.name}</Text>
        </View>

        {/* Corps du relevé */}
        {fullFormationData.semesters.map(semester => (
            <View key={semester.id} style={styles.semesterCard}>
                <Text style={styles.semesterTitle}>{semester.name}</Text>
                {semester.ues.map(ue => (
                    <View key={ue.id} style={styles.ueTable}>
                        {/* En-tête de l'UE */}
                        <View style={styles.ueHeader}>
                            <Text style={{...styles.ueHeaderText, width: '60%'}}>{ue.name}</Text>
                            <Text style={{...styles.ueHeaderText, width: '25%', textAlign: 'center'}}>Moyenne UE</Text>
                            <Text style={{...styles.ueHeaderText, width: '15%', textAlign: 'center'}}>Statut</Text>
                        </View>
                        {/* Ligne Résumé de l'UE */}
                         <View style={styles.ueRow}>
                            <Text style={{...styles.ueCell, width: '60%', fontFamily: 'Helvetica-Bold'}}>{ue.ecs.map(ec => ec.name).join(', ')}</Text>
                            <Text style={{...styles.ueCell, width: '25%', textAlign: 'center', fontFamily: 'Helvetica-Bold'}}>{ue.average.toFixed(2)}</Text>
                            <Text style={{...styles.ueCell, width: '15%', textAlign: 'center', fontFamily: 'Helvetica-Bold', color: ue.isValidated ? 'green' : 'red'}}>{ue.isValidated ? 'Validé' : 'Non Validé'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        ))}

        {/* Pied de page */}
        <Text style={styles.footer} fixed>
            Généré le {new Date().toLocaleDateString('fr-FR')} - Document non contractuel
        </Text>
      </Page>
    </Document>
  );
};