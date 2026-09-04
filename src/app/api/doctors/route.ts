import { appointments } from "@/lib/mock-data/appointments";
import { availabilitySlots } from "@/lib/mock-data/availability";
import { doctors } from "@/lib/mock-data/doctors";
import { withDoctorsAvailability } from "@/lib/doctors/availability-status";

export async function GET() {
  const data = withDoctorsAvailability(
    doctors,
    availabilitySlots,
    appointments,
  );

  return Response.json({ data });
}
