export type BookingStatus = "idle" | "confirming" | "confirmed";

export type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};