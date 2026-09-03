import type { Prescription } from "@/types/prescription";

export const prescriptions: Prescription[] = [
  {
    id: "pres-001",
    appointmentId: "apt-004",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",
    patientId: "user-1788345848958",
    patientName: "Neha Kapoor",
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
    createdAt: "2026-08-28T12:30:00",
    updatedAt: "2026-08-28T12:30:00",
  },
  {
    id: "pres-002",
    appointmentId: "apt-001",
    doctorId: "doc-001",
    doctorName: "Dr. Ananya Sharma",
    patientId: "pat-001",
    patientName: "Rahul Mehta",
    diagnosis: "Common cold",
    medicines: [
      {
        id: "med-003",
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "3 days",
        instructions: "Take after meals.",
      },
    ],
    generalInstructions:
      "Rest well and drink plenty of fluids.",
    createdAt: "2026-09-02T16:06:32.481Z",
    updatedAt: "2026-09-02T16:06:32.481Z",
  },
];