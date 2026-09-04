import type { PublicDoctor } from "@/types/public-doctor";

export type DoctorFilters = {
  query: string;
  specialty: string;
  location: string;
};

export function filterPublicDoctors(
  doctors: PublicDoctor[],
  filters: DoctorFilters,
): PublicDoctor[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return doctors.filter((doctor) => {
    const matchesSpecialty =
      !filters.specialty || doctor.specialty === filters.specialty;

    const matchesLocation =
      !filters.location || doctor.location === filters.location;

    if (!matchesSpecialty || !matchesLocation) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      doctor.name,
      doctor.specialty,
      doctor.qualification,
      doctor.location,
      doctor.bio,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getUniqueSpecialties(doctors: PublicDoctor[]): string[] {
  return [...new Set(doctors.map((doctor) => doctor.specialty))].sort();
}

export function getUniqueLocations(doctors: PublicDoctor[]): string[] {
  return [...new Set(doctors.map((doctor) => doctor.location))].sort();
}
