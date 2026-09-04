import type { Doctor } from "@/types/doctor";
import type { PublicDoctor } from "@/types/public-doctor";

export function toPublicDoctor(doctor: Doctor): PublicDoctor {
  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    qualification: doctor.qualification,
    experienceYears: doctor.experienceYears,
    location: doctor.address,
    consultationFee: doctor.consultationFee,
    acceptingAppointments: doctor.available,
    imageUrl: doctor.imageUrl,
    bio: buildPublicBio(doctor),
    consultationTypes: ["in-person", "video"],
  };
}

function buildPublicBio(doctor: Doctor): string {
  return `${doctor.name} is a ${doctor.specialty} specialist with ${doctor.experienceYears} years of clinical experience. Credentials include ${doctor.qualification}. Based in ${doctor.address}, providing thoughtful, patient-centered care.`;
}

export function toPublicDoctors(doctors: Doctor[]): PublicDoctor[] {
  return doctors.map(toPublicDoctor);
}
