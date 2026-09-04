import type { Prescription } from "@/types/prescription";

import {
  DEMO_DOCTOR,
  DEMO_DOCTOR_2,
  DEMO_PATIENT,
} from "@/lib/mock-data/accounts";

export const prescriptions: Prescription[] = [
  {
    id: "pres-001",
    appointmentId: "apt-105",
    doctorId: DEMO_DOCTOR.id,
    doctorName: DEMO_DOCTOR.name,
    patientId: DEMO_PATIENT.id,
    patientName: DEMO_PATIENT.name,
    diagnosis: "Viral fever and mild dehydration",
    medicines: [
      {
        id: "med-001",
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take after meals with plenty of water.",
      },
      {
        id: "med-002",
        name: "Cetirizine",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "Take at night after dinner.",
      },
    ],
    generalInstructions:
      "Rest well, stay hydrated, and avoid strenuous activity until symptoms improve.",
    createdAt: "2026-08-30T11:45:00",
    updatedAt: "2026-08-30T11:45:00",
  },
  {
    id: "pres-002",
    appointmentId: "apt-203",
    doctorId: DEMO_DOCTOR.id,
    doctorName: DEMO_DOCTOR.name,
    patientId: "pat-004",
    patientName: "Neha Kapoor",
    diagnosis: "Vitamin D deficiency",
    medicines: [
      {
        id: "med-003",
        name: "Cholecalciferol",
        dosage: "60,000 IU",
        frequency: "Once weekly",
        duration: "8 weeks",
        instructions: "Take after breakfast on Sunday.",
      },
    ],
    generalInstructions: "Get 15 minutes of morning sunlight daily.",
    createdAt: "2026-08-28T12:15:00",
    updatedAt: "2026-08-28T12:15:00",
  },
  {
    id: "pres-003",
    appointmentId: "apt-106",
    doctorId: DEMO_DOCTOR.id,
    doctorName: DEMO_DOCTOR.name,
    patientId: DEMO_PATIENT.id,
    patientName: DEMO_PATIENT.name,
    diagnosis: "Seasonal allergic rhinitis",
    medicines: [
      {
        id: "med-004",
        name: "Levocetirizine",
        dosage: "5 mg",
        frequency: "Once daily",
        duration: "10 days",
        instructions: "Take at bedtime.",
      },
      {
        id: "med-005",
        name: "Fluticasone nasal spray",
        dosage: "2 sprays per nostril",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Use in the morning.",
      },
    ],
    generalInstructions:
      "Avoid known allergens and keep windows closed during high pollen days.",
    createdAt: "2026-08-25T15:45:00",
    updatedAt: "2026-08-25T15:45:00",
  },
  {
    id: "pres-004",
    appointmentId: "apt-302",
    doctorId: DEMO_DOCTOR_2.id,
    doctorName: DEMO_DOCTOR_2.name,
    patientId: "pat-008",
    patientName: "Kavya Nair",
    diagnosis: "Mild acne vulgaris",
    medicines: [
      {
        id: "med-006",
        name: "Adapalene gel",
        dosage: "0.1%",
        frequency: "Once daily",
        duration: "6 weeks",
        instructions: "Apply a thin layer at night on clean skin.",
      },
    ],
    generalInstructions: "Use non-comedogenic sunscreen during the day.",
    createdAt: "2026-09-02T15:40:00",
    updatedAt: "2026-09-02T15:40:00",
  },
];
