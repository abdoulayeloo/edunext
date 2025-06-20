import React from "react";

interface Params {
  params: { academicYearId: string };
}
export default function page({ params }: Params) {
  const { academicYearId } = params;
  return (
    <div>
      <h1>Academic Year: {academicYearId}</h1>
    </div>
  );
}
