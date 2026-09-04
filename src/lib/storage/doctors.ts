import { seedDoctors } from "@/lib/mock-data/accounts";

export type StoredDoctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  registrationNumber: string;
  address: string;
  password: string;
};

const STORAGE_KEY = "schedula_doctors";

function readDoctors(): StoredDoctor[] {
  const storedDoctors = localStorage.getItem(STORAGE_KEY);

  if (!storedDoctors) {
    return [];
  }

  try {
    return JSON.parse(storedDoctors) as StoredDoctor[];
  } catch {
    return [];
  }
}

function writeDoctors(doctors: StoredDoctor[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

function ensureSeedDoctors() {
  const doctors = readDoctors();
  const merged = [...doctors];

  for (const seed of seedDoctors) {
    const exists = merged.some(
      (doctor) => doctor.email.toLowerCase() === seed.email.toLowerCase(),
    );

    if (!exists) {
      merged.push(seed);
    }
  }

  if (merged.length === 0) {
    writeDoctors(seedDoctors);
    return seedDoctors;
  }

  if (merged.length !== doctors.length) {
    writeDoctors(merged);
  }

  return merged;
}

export function getDoctors(): StoredDoctor[] {
  if (typeof window === "undefined") {
    return [];
  }

  return ensureSeedDoctors();
}

export function saveDoctor(doctor: StoredDoctor): void {
  const doctors = getDoctors();
  const email = doctor.email.trim().toLowerCase();

  if (doctors.some((existing) => existing.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  writeDoctors([...doctors, doctor]);
}
