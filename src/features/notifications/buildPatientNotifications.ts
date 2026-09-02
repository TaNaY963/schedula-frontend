import type { Appointment } from "@/types/appointment";
import type { Prescription } from "@/types/prescription";

import type { PatientNotification } from "@/features/notifications/types";

function formatAppointmentDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAppointmentTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAppointmentStart(appointment: Appointment) {
  return new Date(`${appointment.date}T${appointment.startTime}:00`);
}

export function buildPatientNotifications(
  appointments: Appointment[],
  prescriptions: Prescription[],
  now = new Date(),
): PatientNotification[] {
  const notifications: PatientNotification[] = [];

  for (const appointment of appointments) {
    const href = `/user/appointments/${appointment.id}`;

    if (appointment.status === "pending") {
      notifications.push({
        id: `${appointment.id}:pending`,
        appointmentId: appointment.id,
        title: "Appointment awaiting confirmation",
        message: `${appointment.doctorName} has received your appointment request for ${formatAppointmentDate(appointment.date)}.`,
        date: appointment.createdAt,
        type: "appointment",
        href,
      });
    }

    if (
      appointment.status === "confirmed" ||
      appointment.status === "upcoming"
    ) {
      notifications.push({
        id: `${appointment.id}:confirmed`,
        appointmentId: appointment.id,
        title: "Appointment confirmed",
        message: `Your appointment with ${appointment.doctorName} on ${formatAppointmentDate(appointment.date)} has been confirmed.`,
        date: appointment.updatedAt,
        type: "status",
        href,
      });

      const millisecondsUntilStart =
        getAppointmentStart(appointment).getTime() - now.getTime();

      if (
        millisecondsUntilStart > 0 &&
        millisecondsUntilStart <= 24 * 60 * 60 * 1000
      ) {
        notifications.push({
          id: `${appointment.id}:reminder`,
          appointmentId: appointment.id,
          title: "Upcoming appointment reminder",
          message: `Your appointment with ${appointment.doctorName} is on ${formatAppointmentDate(appointment.date)} at ${formatAppointmentTime(appointment.startTime)}.`,
          date: appointment.updatedAt,
          type: "reminder",
          href,
        });
      }
    }

    if (appointment.status === "completed") {
      notifications.push({
        id: `${appointment.id}:completed`,
        appointmentId: appointment.id,
        title: "Appointment completed",
        message: `Your appointment with ${appointment.doctorName} has been completed.`,
        date: appointment.updatedAt,
        type: "status",
        href,
      });
    }

    if (appointment.status === "cancelled") {
      notifications.push({
        id: `${appointment.id}:cancelled`,
        appointmentId: appointment.id,
        title: "Appointment cancelled",
        message: `Your appointment with ${appointment.doctorName} has been cancelled.`,
        date: appointment.updatedAt,
        type: "status",
        href,
      });
    }

    if (appointment.status === "missed") {
      notifications.push({
        id: `${appointment.id}:missed`,
        appointmentId: appointment.id,
        title: "Appointment missed",
        message: `You missed your appointment with ${appointment.doctorName}.`,
        date: appointment.updatedAt,
        type: "status",
        href,
      });
    }
  }

  for (const prescription of prescriptions) {
    notifications.push({
      id: `prescription:${prescription.id}`,
      appointmentId: prescription.appointmentId,
      title: "Prescription ready",
      message: `${prescription.doctorName} added a prescription for ${prescription.diagnosis}.`,
      date: prescription.createdAt,
      type: "prescription",
      href: `/user/appointments/${prescription.appointmentId}`,
    });
  }

  return notifications.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
}
