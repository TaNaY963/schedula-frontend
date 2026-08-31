export type AvailabilitySlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  recurring: boolean;
  recurrence?: "daily" | "weekly";
};