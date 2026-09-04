import type { TimeSlot } from "@/features/booking/types";

const slots: TimeSlot[] = [
  { id: "slot-1", time: "09:00 AM", available: true },
  { id: "slot-2", time: "09:30 AM", available: true },
  { id: "slot-3", time: "10:00 AM", available: false },
  { id: "slot-4", time: "10:30 AM", available: true },
  { id: "slot-5", time: "11:00 AM", available: true },
  { id: "slot-6", time: "11:30 AM", available: false },
];

export async function getAvailableSlots(): Promise<TimeSlot[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return slots;
}