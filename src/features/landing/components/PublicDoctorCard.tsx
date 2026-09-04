import Link from "next/link";

import DoctorAvatar from "@/features/doctors/components/DoctorAvatar";
import SpecialtyIcon from "@/features/doctors/components/SpecialtyIcon";
import { getSpecialtyMeta } from "@/features/doctors/specialties";
import type { PublicDoctor } from "@/types/public-doctor";
import type { Doctor } from "@/types/doctor";

type PublicDoctorCardProps = {
  doctor: PublicDoctor;
};

function toAvatarDoctor(doctor: PublicDoctor): Doctor {
  return {
    id: doctor.id,
    name: doctor.name,
    imageUrl: doctor.imageUrl,
    email: "",
    phone: "",
    specialty: doctor.specialty,
    qualification: doctor.qualification,
    experienceYears: doctor.experienceYears,
    registrationNumber: "",
    address: doctor.location,
    consultationFee: doctor.consultationFee,
    available: doctor.acceptingAppointments,
  };
}

export default function PublicDoctorCard({ doctor }: PublicDoctorCardProps) {
  const specialtyMeta = getSpecialtyMeta(doctor.specialty);
  const avatarDoctor = toAvatarDoctor(doctor);

  return (
    <article className="schedula-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="relative h-44">
        <DoctorAvatar doctor={avatarDoctor} size="xl" className="h-full w-full" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-4 pt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
              <p className="mt-1 text-sm text-white/85">{doctor.specialty}</p>
            </div>

            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg ${specialtyMeta.iconBgClass} ${specialtyMeta.iconColorClass}`}
              aria-hidden="true"
            >
              <SpecialtyIcon specialty={doctor.specialty} className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {doctor.bio}
        </p>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Qualification</dt>
            <dd className="text-right font-medium">{doctor.qualification}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Experience</dt>
            <dd className="font-medium">{doctor.experienceYears} years</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Location</dt>
            <dd className="font-medium">{doctor.location}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Consultation</dt>
            <dd className="font-medium">₹{doctor.consultationFee}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
          <span
            className={`text-sm font-medium ${
              doctor.acceptingAppointments
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]"
            }`}
          >
            {doctor.acceptingAppointments
              ? "Accepting appointments"
              : "Currently unavailable"}
          </span>

          <Link
            href={`/doctors/${doctor.id}`}
            className="schedula-btn-primary"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
