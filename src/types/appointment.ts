//export type AppointmentStatus = "confirmed" | "pending" | "cancelled";
//export type Appointment = { id: string; patient: { name: string; initials: string; age: number }; clinician: string; specialty: string; startsAt: string; durationMinutes: number; status: AppointmentStatus; reason: string; room: string };

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "missed";

export type AppointmentType = "video" | "in-person";

/** regular = 15 min follow-up, normal = 30 min consultation */
export type CheckupType = "regular" | "normal";

export interface Appointment {
  id: string;

  doctorId: string;
  doctorName: string;

  patientId: string;
  patientName: string;

  date: string;
  startTime: string;
  endTime: string;

  type: AppointmentType;
  status: AppointmentStatus;

  reason?: string;
  checkupType?: CheckupType;

  createdAt: string;
  updatedAt: string;

  prescriptionAvailable?: boolean;

  rescheduledAt?: string;
  cancelledAt?: string;
  cancelledBy?: "patient" | "doctor";
}

