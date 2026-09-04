import { NextResponse } from "next/server";

import { hasPatientVisitedDoctor } from "@/lib/availability/bookable-slots";
import { appointments } from "@/lib/mock-data/appointments";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");

  if (!patientId || !doctorId) {
    return NextResponse.json(
      {
        error: "patientId and doctorId are required",
      },
      { status: 400 },
    );
  }

  const hasVisitedDoctor = hasPatientVisitedDoctor(
    appointments,
    patientId,
    doctorId,
  );

  return NextResponse.json({
    data: {
      hasVisitedDoctor,
    },
  });
}
