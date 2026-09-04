import {
  CHECKUP_DURATIONS,
  getBookableDates,
} from "@/lib/availability/bookable-slots";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";
import type { Appointment } from "@/types/appointment";
import type { Doctor } from "@/types/doctor";

export function doctorHasBookableSlots(
  doctorId: string,
  availability: AvailabilitySlot[],
  appointments: Appointment[],
): boolean {
  return (
    getBookableDates({
      doctorId,
      durationMinutes: CHECKUP_DURATIONS.regular,
      availability,
      appointments,
    }).length > 0
  );
}

export function withDoctorAvailability(
  doctor: Doctor,
  availability: AvailabilitySlot[],
  appointments: Appointment[],
): Doctor {
  return {
    ...doctor,
    available:
      doctor.available &&
      doctorHasBookableSlots(doctor.id, availability, appointments),
  };
}

export function withDoctorsAvailability(
  doctors: Doctor[],
  availability: AvailabilitySlot[],
  appointments: Appointment[],
): Doctor[] {
  return doctors.map((doctor) =>
    withDoctorAvailability(doctor, availability, appointments),
  );
}
