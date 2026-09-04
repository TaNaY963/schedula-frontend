import { toPublicDoctors } from "@/lib/doctors/to-public-doctor";
import { withDoctorsAvailability } from "@/lib/doctors/availability-status";
import { appointments } from "@/lib/mock-data/appointments";
import { availabilitySlots } from "@/lib/mock-data/availability";
import { doctors } from "@/lib/mock-data/doctors";

export async function GET() {
  const enrichedDoctors = withDoctorsAvailability(
    doctors,
    availabilitySlots,
    appointments,
  );

  return Response.json({ data: toPublicDoctors(enrichedDoctors) });
}
