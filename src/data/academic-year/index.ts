// src/data/academic-year.ts
"use server";
import { prisma } from "@/lib/db";
export const getAcademicYears = async () => prisma.academicYear.findMany({ orderBy: { year: "desc" } });