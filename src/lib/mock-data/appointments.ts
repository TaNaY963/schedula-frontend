// import type { Appointment } from "@/types/appointment";
// export const appointments: Appointment[] = [
//   { id: "apt-1042", patient: { name: "Maya Patel", initials: "MP", age: 34 }, clinician: "Dr. Anika Rao", specialty: "General medicine", startsAt: "2026-08-28T09:00:00", durationMinutes: 30, status: "confirmed", reason: "Follow-up consultation", room: "Room 04" },
//   { id: "apt-1043", patient: { name: "Ethan Brooks", initials: "EB", age: 41 }, clinician: "Dr. Anika Rao", specialty: "General medicine", startsAt: "2026-08-28T10:00:00", durationMinutes: 45, status: "pending", reason: "Annual wellness visit", room: "Room 04" },
//   { id: "apt-1044", patient: { name: "Sofia Chen", initials: "SC", age: 28 }, clinician: "Dr. Martin Cole", specialty: "Dermatology", startsAt: "2026-08-28T11:15:00", durationMinutes: 30, status: "confirmed", reason: "Skin consultation", room: "Room 12" },
//   { id: "apt-1045", patient: { name: "Noah Williams", initials: "NW", age: 52 }, clinician: "Dr. Anika Rao", specialty: "General medicine", startsAt: "2026-08-28T14:00:00", durationMinutes: 30, status: "cancelled", reason: "Blood pressure review", room: "Room 04" },
// ];

import { Appointment } from "@/types/appointment";

export const appointments: Appointment[] = [
  {
    id: "apt-001",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-001",
    patientName: "Rahul Mehta",

    date: "2026-09-02",
    startTime: "10:00",
    endTime: "10:30",

    type: "video",
    status: "confirmed",

    reason: "Regular health consultation",

    createdAt: "2026-09-01T09:00:00",
    updatedAt: "2026-09-01T09:00:00",

    prescriptionAvailable: false,
  },

  {
    id: "apt-002",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-002",
    patientName: "Priya Singh",

    date: "2026-09-02",
    startTime: "12:00",
    endTime: "12:30",

    type: "in-person",
    status: "pending",

    reason: "Skin consultation",

    createdAt: "2026-09-01T10:00:00",
    updatedAt: "2026-09-01T10:00:00",

    prescriptionAvailable: false,
  },

  {
    id: "apt-003",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-003",
    patientName: "Aman Verma",

    date: "2026-09-03",
    startTime: "15:00",
    endTime: "15:30",

    type: "video",
    status: "upcoming",

    reason: "Follow-up consultation",

    createdAt: "2026-08-30T11:00:00",
    updatedAt: "2026-08-30T11:00:00",

    prescriptionAvailable: false,
  },

  {
    id: "apt-004",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-004",
    patientName: "Neha Kapoor",

    date: "2026-08-28",
    startTime: "11:00",
    endTime: "11:30",

    type: "in-person",
    status: "completed",

    reason: "General consultation",

    createdAt: "2026-08-27T09:00:00",
    updatedAt: "2026-08-28T12:00:00",

    prescriptionAvailable: true,
  },

  {
    id: "apt-005",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-005",
    patientName: "Rohit Joshi",

    date: "2026-08-27",
    startTime: "16:00",
    endTime: "16:30",

    type: "video",
    status: "missed",

    reason: "Follow-up",

    createdAt: "2026-08-26T10:00:00",
    updatedAt: "2026-08-27T17:00:00",

    prescriptionAvailable: false,
  },

  {
    id: "apt-006",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",

    patientId: "pat-006",
    patientName: "Sneha Gupta",

    date: "2026-08-25",
    startTime: "14:00",
    endTime: "14:30",

    type: "in-person",
    status: "cancelled",

    reason: "Routine check-up",

    createdAt: "2026-08-24T09:00:00",
    updatedAt: "2026-08-24T15:00:00",

    prescriptionAvailable: false,
  },
];

