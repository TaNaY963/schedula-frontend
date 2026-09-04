import { NextResponse } from "next/server";

import {
  getBookableDates,
  getBookableStartTimes,
} from "@/lib/availability/bookable-slots";
import { appointments } from "@/lib/mock-data/appointments";
import { availabilitySlots } from "@/lib/mock-data/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");
  const durationMinutes = Number(searchParams.get("durationMinutes"));

  if (!doctorId || !durationMinutes || durationMinutes <= 0) {
    return NextResponse.json(
      {
        error: "doctorId and durationMinutes are required",
      },
      { status: 400 },
    );
  }

  if (date) {
    const startTimes = getBookableStartTimes({
      doctorId,
      date,
      durationMinutes,
      availability: availabilitySlots,
      appointments,
    });

    return NextResponse.json({ data: startTimes });
  }

  const dates = getBookableDates({
    doctorId,
    durationMinutes,
    availability: availabilitySlots,
    appointments,
  });

  return NextResponse.json({ data: dates });
}
