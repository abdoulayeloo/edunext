// prisma/seed.ts
import { PrismaClient, Role, DiplomaLevel, EvaluationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // --- 1. Nettoyage de la base de données ---
  console.log("🧹 Cleaning up existing data...");
  await db.grade.deleteMany();
  await db.evaluation.deleteMany();
  await db.enrollment.deleteMany();
  await db.eC.deleteMany();
  await db.uE.deleteMany();
  await db.semester.deleteMany();
  await db.formation.deleteMany();
  await db.academicYear.deleteMany();
  await db.passwordResetToken.deleteMany();
  await db.verificationToken.deleteMany();
  await db.student.deleteMany();
  await db.professor.deleteMany();
  await db.admin.deleteMany();
  await db.user.deleteMany();
  console.log("✅ Data cleaned.");

  // --- 2. Création des utilisateurs ---
  console.log("👤 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);


  const admin = await db.user.create({
    data: {
      name: "Admin EduNext",
      email: "admin@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.ADMIN,
      adminProfile: { create: {} },
    },
    include: { adminProfile: true },
  });

  const prof1 = await db.user.create({
    data: {
      name: "Pr. Moussa Diop",
      email: "prof.diop@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.PROFESSOR,
      professorProfile: { create: { specialty: "Informatique" } },
    },
    include: { professorProfile: true },
  });

  const prof2 = await db.user.create({
    data: {
      name: "Pr. Awa Gueye",
      email: "prof.gueye@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.PROFESSOR,
      professorProfile: { create: { specialty: "Mathématiques" } },
    },
    include: { professorProfile: true },
  });

  const student1 = await db.user.create({
    data: {
      name: "Aminata Fall",
      email: "aminata.fall@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.STUDENT,
      studentProfile: { create: { studentIdNumber: "SN-L2-001" } },
    },
    include: { studentProfile: true },
  });

  const student2 = await db.user.create({
    data: {
      name: "Ousmane Sow",
      email: "ousmane.sow@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.STUDENT,
      studentProfile: { create: { studentIdNumber: "SN-L2-002" } },
    },
    include: { studentProfile: true },
  });

  const student3 = await db.user.create({
    data: {
      name: "Fatou Ba",
      email: "fatou.ba@edunext.sn",
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      role: Role.STUDENT,
      studentProfile: { create: { studentIdNumber: "SN-M1-001" } },
    },
    include: { studentProfile: true },
  });

  console.log("✅ Users created.");

  // --- 3. Création de la structure académique ---
  console.log("🏗️ Creating academic structure...");
  const academicYear = await db.academicYear.create({
    data: {
      year: "2024-2025",
      startDate: new Date("2024-10-01T08:00:00Z"),
      endDate: new Date("2025-07-31T18:00:00Z"),
    },
  });

  // == FORMATION 1: Licence Informatique ==
  const l2Info = await db.formation.create({
    data: {
      name: "Licence 2 - Informatique",
      diplomaLevel: DiplomaLevel.LICENCE,
    },
  });
  const s3Info = await db.semester.create({
    data: { name: "Semestre 3", formationId: l2Info.id },
  });
  const ueAlgo = await db.uE.create({
    data: { name: "UEF 3.1: Algorithmique & Programmation", totalCredits: 12, semesterId: s3Info.id },
  });
  const ecAlgo = await db.eC.create({
    data: { name: "Algorithmique Avancée", credits: 6, ueId: ueAlgo.id, professorId: prof1.professorProfile!.id },
  });
  const ecPoo = await db.eC.create({
    data: { name: "Programmation Orientée Objet", credits: 6, ueId: ueAlgo.id, professorId: prof1.professorProfile!.id },
  });
  
  // == FORMATION 2: Master CCA ==
  const m1Cca = await db.formation.create({
    data: { name: "Master 1 - CCA", diplomaLevel: DiplomaLevel.MASTER }
  });
  const s1M1Cca = await db.semester.create({
    data: { name: "Semestre 1", formationId: m1Cca.id }
  });
  const ueCompta = await db.uE.create({
    data: { name: "UEF 1.1: Comptabilité Approfondie", totalCredits: 10, semesterId: s1M1Cca.id}
  });
  const ecCompta = await db.eC.create({
    data: { name: "Comptabilité des sociétés", credits: 5, ueId: ueCompta.id, professorId: prof2.professorProfile!.id}
  });

  console.log("✅ Academic structure created.");

  // --- 4. Inscriptions des étudiants ---
  console.log("✍️ Enrolling students...");
  await db.enrollment.createMany({
    data: [
      { studentId: student1.studentProfile!.id, formationId: l2Info.id, academicYearId: academicYear.id },
      { studentId: student2.studentProfile!.id, formationId: l2Info.id, academicYearId: academicYear.id },
      { studentId: student3.studentProfile!.id, formationId: m1Cca.id, academicYearId: academicYear.id },
    ],
  });
  console.log("✅ Students enrolled.");

  // --- 5. Création des évaluations et des notes ---
  console.log("💯 Creating evaluations and grades...");
  // Évaluations pour le cours d'Algorithmique Avancée
  const evalAlgoCC = await db.evaluation.create({ data: { ecId: ecAlgo.id, type: EvaluationType.CONTROLE_CONTINU, date: new Date("2024-11-20T10:00:00Z") } });
  const evalAlgoFinal = await db.evaluation.create({ data: { ecId: ecAlgo.id, type: EvaluationType.EXAM_FINAL, date: new Date("2025-01-15T09:00:00Z") } });

  // Notes pour les étudiants en L2 Info
  await db.grade.create({ data: { studentId: student1.studentProfile!.id, evaluationId: evalAlgoCC.id, value: 16.5 } });
  await db.grade.create({ data: { studentId: student1.studentProfile!.id, evaluationId: evalAlgoFinal.id, value: 14 } });
  await db.grade.create({ data: { studentId: student2.studentProfile!.id, evaluationId: evalAlgoCC.id, value: 12 } });
  await db.grade.create({ data: { studentId: student2.studentProfile!.id, evaluationId: evalAlgoFinal.id, value: 9.5 } });

  // Évaluation pour le cours de Comptabilité
  const evalComptaFinal = await db.evaluation.create({ data: { ecId: ecCompta.id, type: EvaluationType.EXAM_FINAL, date: new Date("2025-01-20T14:00:00Z") } });
  
  // Note pour l'étudiante en Master CCA
  await db.grade.create({ data: { studentId: student3.studentProfile!.id, evaluationId: evalComptaFinal.id, value: 15 } });

  console.log("✅ Evaluations and grades created.");

  console.log("🎉 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });