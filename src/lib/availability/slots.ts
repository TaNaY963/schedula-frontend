import { availabilitySlots } from "@/lib/mock-data/availability";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";
import { isSlotBookable } from "@/lib/availability/bookable-slots";
import { appointments } from "@/lib/mock-data/appointments";

type SlotMatch = {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export function findAvailabilitySlot({
  doctorId,
  date,
  startTime,
  endTime,
}: SlotMatch): AvailabilitySlot | undefined {
  return availabilitySlots.find(
    (slot) =>
      slot.doctorId === doctorId &&
      slot.date === date &&
      slot.startTime === startTime &&
      slot.endTime === endTime,
  );
}

export function bookAvailabilitySlot(match: SlotMatch) {
  if (
    !isSlotBookable({
      ...match,
      availability: availabilitySlots,
      appointments,
    })
  ) {
    return {
      ok: false as const,
      error: "Selected time is no longer available.",
    };
  }

  return { ok: true as const };
}

export function releaseAvailabilitySlot(_match: SlotMatch) {
  return undefined;
}
