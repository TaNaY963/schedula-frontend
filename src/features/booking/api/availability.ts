import type { AvailabilitySlot } from "@/types/availability";

type AvailabilityResponse = {
  data: AvailabilitySlot[];
};

export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const response = await fetch("/api/availability");

  if (!response.ok) {
    throw new Error("Unable to load availability");
  }

  const body: AvailabilityResponse = await response.json();

  return body.data;
}