// src/app/(app)/admin/academic-years/page.tsx
import { getAcademicYears } from "@/data/academic-year";
import { AcademicYearsClient } from "./_components/academic-year-client";

const AcademicYearsPage = async () => {
  const academicYears = await getAcademicYears();

  return (
    <div className="p-6">
      <AcademicYearsClient academicYears={academicYears} />
    </div>
  );
};

export default AcademicYearsPage;