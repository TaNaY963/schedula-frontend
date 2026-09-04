import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";
import type { Appointment, CheckupType } from "@/types/appointment";

export const CHECKUP_DURATIONS: Record<CheckupType, number> = {
  regular: 15,
  normal: 30,
};

export const SLOT_INTERVAL_MINUTES = 15;

const OCCUPIED_STATUSES = new Set([
  "pending",
  "confirmed",
  "upcoming",
  "completed",
]);

const PRIOR_VISIT_STATUSES = new Set([
  "pending",
  "confirmed",
  "upcoming",
  "completed",
]);

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");

  return `${hours}:${mins}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number) {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

export function getCheckupDurationMinutes(checkupType: CheckupType) {
  return CHECKUP_DURATIONS[checkupType];
}

export function getCheckupTypeLabel(checkupType: CheckupType) {
  return checkupType === "regular"
    ? "Regular checkup (15 min)"
    : "Normal checkup (30 min)";
}

export function hasPatientVisitedDoctor(
  appointments: Appointment[],
  patientId: string,
  doctorId: string,
) {
  return appointments.some(
    (appointment) =>
      appointment.patientId === patientId &&
      appointment.doctorId === doctorId &&
      PRIOR_VISIT_STATUSES.has(appointment.status),
  );
}

function appointmentsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
) {
  return startA < endB && endA > startB;
}

function getDoctorAppointmentsForDate(
  appointments: Appointment[],
  doctorId: string,
  date: string,
) {
  return appointments.filter(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date === date &&
      OCCUPIED_STATUSES.has(appointment.status),
  );
}

function getAvailabilityWindows(
  availability: AvailabilitySlot[],
  doctorId: string,
  date: string,
) {
  return availability.filter(
    (slot) =>
      slot.doctorId === doctorId &&
      slot.date === date &&
      slot.available,
  );
}

export function getBookableStartTimes({
  doctorId,
  date,
  durationMinutes,
  availability,
  appointments,
}: {
  doctorId: string;
  date: string;
  durationMinutes: number;
  availability: AvailabilitySlot[];
  appointments: Appointment[];
}) {
  const windows = getAvailabilityWindows(availability, doctorId, date);
  const doctorAppointments = getDoctorAppointmentsForDate(
    appointments,
    doctorId,
    date,
  );

  const startTimes = new Set<string>();

  for (const window of windows) {
    const windowStart = timeToMinutes(window.startTime);
    const windowEnd = timeToMinutes(window.endTime);

    for (
      let start = windowStart;
      start + durationMinutes <= windowEnd;
      start += SLOT_INTERVAL_MINUTES
    ) {
      const end = start + durationMinutes;

      const hasConflict = doctorAppointments.some((appointment) =>
        appointmentsOverlap(
          start,
          end,
          timeToMinutes(appointment.startTime),
          timeToMinutes(appointment.endTime),
        ),
      );

      if (!hasConflict) {
        startTimes.add(minutesToTime(start));
      }
    }
  }

  return [...startTimes].sort();
}

export function getBookableDates({
  doctorId,
  durationMinutes,
  availability,
  appointments,
}: {
  doctorId: string;
  durationMinutes: number;
  availability: AvailabilitySlot[];
  appointments: Appointment[];
}) {
  const dates = new Set(
    availability
      .filter((slot) => slot.doctorId === doctorId && slot.available)
      .map((slot) => slot.date),
  );

  return [...dates]
    .filter(
      (date) =>
        getBookableStartTimes({
          doctorId,
          date,
          durationMinutes,
          availability,
          appointments,
        }).length > 0,
    )
    .sort();
}

export function isSlotBookable({
  doctorId,
  date,
  startTime,
  endTime,
  availability,
  appointments,
}: {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  availability: AvailabilitySlot[];
  appointments: Appointment[];
}) {
  const durationMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);

  if (durationMinutes <= 0) {
    return false;
  }

  const bookableStartTimes = getBookableStartTimes({
    doctorId,
    date,
    durationMinutes,
    availability,
    appointments,
  });

  return bookableStartTimes.includes(startTime);
}
