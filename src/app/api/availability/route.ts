import { availabilitySlots } from "@/lib/mock-data/availability";

export async function GET() {
  return Response.json({ data: availabilitySlots });
}