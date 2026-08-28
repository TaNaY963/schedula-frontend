import type { Doctor } from "@/types/doctor";

export const doctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Anika Rao",
    specialty: "General Medicine",
    qualification: "MBBS, MD",
    experienceYears: 10,
    consultationFee: 800,
    available: true,
  },
  {
    id: "doc-002",
    name: "Dr. Martin Cole",
    specialty: "Dermatology",
    qualification: "MBBS, MD Dermatology",
    experienceYears: 8,
    consultationFee: 1000,
    available: true,
  },
  {
    id: "doc-003",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    qualification: "MBBS, MD Cardiology",
    experienceYears: 12,
    consultationFee: 1200,
    available: false,
  },
];