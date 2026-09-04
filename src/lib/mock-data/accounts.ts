/**
 * Demo login accounts for local testing (no backend required).
 *
 * Patient: patient@schedula.test / password123
 * Doctor:  doctor@schedula.test / password123
 */

export type SeedPatient = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type SeedDoctor = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  registrationNumber: string;
  address: string;
};

export const DEMO_PATIENT: SeedPatient = {
  id: "pat-001",
  name: "Rahul Mehta",
  email: "patient@schedula.test",
  password: "password123",
};

export const DEMO_PATIENT_2: SeedPatient = {
  id: "pat-002",
  name: "Priya Singh",
  email: "priya@schedula.test",
  password: "password123",
};

export const DEMO_DOCTOR: SeedDoctor = {
  id: "doc-001",
  name: "Dr. Anika Rao",
  email: "doctor@schedula.test",
  password: "password123",
  phone: "9876543210",
  specialty: "General Medicine",
  qualification: "MBBS, MD",
  experienceYears: 10,
  registrationNumber: "MED12345",
  address: "Bangalore",
};

export const DEMO_DOCTOR_2: SeedDoctor = {
  id: "doc-002",
  name: "Dr. Martin Cole",
  email: "martin@schedula.test",
  password: "password123",
  phone: "9876543211",
  specialty: "Dermatology",
  qualification: "MBBS, MD Dermatology",
  experienceYears: 8,
  registrationNumber: "MED12346",
  address: "Bangalore",
};

export const seedPatients: SeedPatient[] = [DEMO_PATIENT, DEMO_PATIENT_2];

export const seedDoctors: SeedDoctor[] = [DEMO_DOCTOR, DEMO_DOCTOR_2];

export const DEMO_CREDENTIALS = {
  patient: {
    email: DEMO_PATIENT.email,
    password: DEMO_PATIENT.password,
  },
  doctor: {
    email: DEMO_DOCTOR.email,
    password: DEMO_DOCTOR.password,
  },
} as const;
