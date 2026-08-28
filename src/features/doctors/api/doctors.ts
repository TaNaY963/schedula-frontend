import type { Doctor } from "@/types/doctor";

type DoctorsResponse = {
  data: Doctor[];
};

export async function getDoctors(): Promise<Doctor[]> {
  const response = await fetch("/api/doctors");

  if (!response.ok) {
    throw new Error("Unable to load doctors");
  }

  const body: DoctorsResponse = await response.json();

  return body.data;
}