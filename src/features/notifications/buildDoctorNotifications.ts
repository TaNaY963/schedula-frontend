import type { Appointment } from "@/types/appointment";

import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/lib/formatters/appointments";

export type DoctorNotificationType = "appointment" | "cancellation";

export type DoctorNotification = {
  id: string;
  appointmentId: string;
  title: string;
  message: string;
  date: string;
  type: DoctorNotificationType;
  href: string;
};

export function buildDoctorNotifications(
  appointments: Appointment[],
  doctorId: string,
): DoctorNotification[] {
  const notifications: DoctorNotification[] = [];

  for (const appointment of appointments) {
    if (appointment.doctorId !== doctorId) {
      continue;
    }

    const href = `/doctor/appointments/${appointment.id}`;

    if (appointment.status === "pending") {
      notifications.push({
        id: `${appointment.id}:request`,
        appointmentId: appointment.id,
        title: "New appointment request",
        message: `${appointment.patientName} requested an appointment on ${formatAppointmentDate(appointment.date, "short")} at ${formatAppointmentTime(appointment.startTime)}.`,
        date: appointment.createdAt,
        type: "appointment",
        href,
      });
    }

    if (appointment.status === "cancelled" && appointment.cancelledAt) {
      if (appointment.cancelledBy && appointment.cancelledBy !== "patient") {
        continue;
      }
      notifications.push({
        id: `${appointment.id}:cancelled`,
        appointmentId: appointment.id,
        title: "Appointment cancelled",
        message: `${appointment.patientName} cancelled their appointment on ${formatAppointmentDate(appointment.date, "short")} at ${formatAppointmentTime(appointment.startTime)}.`,
        date: appointment.cancelledAt,
        type: "cancellation",
        href,
      });
    }
  }

  return notifications.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
}
