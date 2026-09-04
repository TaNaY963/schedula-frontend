import type { Doctor } from "@/types/doctor";

import { DEMO_DOCTOR, DEMO_DOCTOR_2 } from "@/lib/mock-data/accounts";

export const doctors: Doctor[] = [
  {
    id: DEMO_DOCTOR.id,
    name: DEMO_DOCTOR.name,
    email: DEMO_DOCTOR.email,
    phone: DEMO_DOCTOR.phone,
    specialty: DEMO_DOCTOR.specialty,
    qualification: DEMO_DOCTOR.qualification,
    experienceYears: DEMO_DOCTOR.experienceYears,
    registrationNumber: DEMO_DOCTOR.registrationNumber,
    address: DEMO_DOCTOR.address,
    consultationFee: 800,
    available: true,
  },
  {
    id: DEMO_DOCTOR_2.id,
    name: DEMO_DOCTOR_2.name,
    email: DEMO_DOCTOR_2.email,
    phone: DEMO_DOCTOR_2.phone,
    specialty: DEMO_DOCTOR_2.specialty,
    qualification: DEMO_DOCTOR_2.qualification,
    experienceYears: DEMO_DOCTOR_2.experienceYears,
    registrationNumber: DEMO_DOCTOR_2.registrationNumber,
    address: DEMO_DOCTOR_2.address,
    consultationFee: 1000,
    available: true,
  },
  {
    id: "doc-003",
    name: "Dr. Sarah Wilson",
    email: "sarah@schedula.test",
    phone: "9876543212",
    specialty: "Cardiology",
    qualification: "MBBS, MD Cardiology",
    experienceYears: 12,
    registrationNumber: "MED12347",
    address: "Bangalore",
    consultationFee: 1200,
    available: false,
  },
];
