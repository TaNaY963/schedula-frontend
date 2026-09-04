import { toPublicDoctor } from "@/lib/doctors/to-public-doctor";
import { withDoctorAvailability } from "@/lib/doctors/availability-status";
import { appointments } from "@/lib/mock-data/appointments";
import { availabilitySlots } from "@/lib/mock-data/availability";
import { doctors } from "@/lib/mock-data/doctors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    return Response.json({ error: "Doctor not found." }, { status: 404 });
  }

  const enrichedDoctor = withDoctorAvailability(
    doctor,
    availabilitySlots,
    appointments,
  );

  return Response.json({ data: toPublicDoctor(enrichedDoctor) });
}
