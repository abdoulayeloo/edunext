// src/components/documents/transcript-document.tsx
"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Définition des types pour les données attendues (vous pouvez les affiner)
type StudentData = NonNullable<
  Awaited<ReturnType<typeof import("@/data/student").getStudentDashboardData>>
>;
type ProcessedFormation = StudentData["fullFormationData"];

interface TranscriptDocumentProps {
  studentName?: string | null;
  formation: ProcessedFormation;
}

// Enregistrement des polices (optionnel mais recommandé pour un meilleur rendu)
// Téléchargez les fichiers de police et placez-les dans votre dossier /public
Font.register({
  family: "Oswald",
  src: `/fonts/Oswald.ttf`,
});
Font.register({
  family: "Lato",
  src: `/fonts/Lato-Regular.ttf`,
});
Font.register({
  family: "Lato Italic",
  src: `/fonts/Lato-Italic.ttf`,
});
Font.register({
  family: "Lato Bold",
  src: `/fonts/Lato-Bold.ttf`,
});

// Définition des styles du document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Lato",
    fontSize: 11,
  },
  header: {
    fontSize: 24,
    fontFamily: "Oswald",
    textAlign: "center",
    marginBottom: 20,
    color: "#1a2b4a",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Lato Bold",
    backgroundColor: "#f3f4f6",
    padding: 5,
    marginBottom: 10,
  },
  studentInfo: {
    marginBottom: 20,
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f3f4f6",
    padding: 5,
    fontFamily: "Lato Bold",
  },
  tableCol: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  //... Ajoutez d'autres styles au besoin
});

export const TranscriptDocument = ({
  studentName,
  formation,
}: TranscriptDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Relevé de Notes - EduNext</Text>

      <View style={styles.studentInfo}>
        <Text>Étudiant(e) : {studentName}</Text>
        <Text>Formation : {formation.name}</Text>
      </View>

      {formation.semesters.map((semester) => (
        <View key={semester.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{semester.name}</Text>
          {semester.ues.map((ue) => (
            <View key={ue.id} style={{ marginBottom: 15 }}>
              <Text style={{ fontFamily: "Lato Bold", marginBottom: 5 }}>
                {ue.name} - (Moyenne: {ue.average.toFixed(2)})
              </Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={{ ...styles.tableColHeader, width: "60%" }}>
                    Élément Constitutif (EC)
                  </Text>
                  <Text
                    style={{
                      ...styles.tableColHeader,
                      width: "20%",
                      textAlign: "center",
                    }}
                  >
                    Moyenne EC
                  </Text>
                  <Text
                    style={{
                      ...styles.tableColHeader,
                      width: "20%",
                      textAlign: "center",
                    }}
                  >
                    Crédits
                  </Text>
                </View>
                {ue.ecs.map((ec) => (
                  <View style={styles.tableRow} key={ec.id}>
                    <Text style={{ ...styles.tableCol, width: "60%" }}>
                      {ec.name}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCol,
                        width: "20%",
                        textAlign: "center",
                      }}
                    >
                      {ec.average !== null ? ec.average.toFixed(2) : "-"}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCol,
                        width: "20%",
                        textAlign: "center",
                      }}
                    >
                      {ec.credits}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);
