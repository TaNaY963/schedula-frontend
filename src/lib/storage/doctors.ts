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

export function getDoctors(): StoredDoctor[] {
  if (typeof window === "undefined") {
    return [];
  }

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

export function saveDoctor(doctor: StoredDoctor): void {
  const doctors = getDoctors();
  const email = doctor.email.trim().toLowerCase();

  if (doctors.some((existing) => existing.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...doctors, doctor]),
  );
}