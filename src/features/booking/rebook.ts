import type { Appointment, AppointmentType } from "@/types/appointment";

export function getRebookPath(appointment: Appointment) {
  const params = new URLSearchParams({
    doctorId: appointment.doctorId,
    type: appointment.type,
    reason: appointment.reason || "Follow-up consultation",
    rebook: "1",
  });

  return `/booking?${params.toString()}`;
}

export function parseAppointmentType(
  value: string | null,
): AppointmentType {
  return value === "video" ? "video" : "in-person";
}
