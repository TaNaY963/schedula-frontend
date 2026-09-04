import type { PublicDoctor } from "@/types/public-doctor";

type PublicDoctorsResponse = {
  data: PublicDoctor[];
};

type PublicDoctorResponse = {
  data: PublicDoctor;
};

export async function getPublicDoctors(): Promise<PublicDoctor[]> {
  const response = await fetch("/api/public/doctors");

  if (!response.ok) {
    throw new Error("Unable to load doctors");
  }

  const body: PublicDoctorsResponse = await response.json();

  return body.data;
}

export async function getPublicDoctor(id: string): Promise<PublicDoctor> {
  const response = await fetch(`/api/public/doctors/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error("Unable to load doctor profile");
  }

  const body: PublicDoctorResponse = await response.json();

  return body.data;
}
