import type { Doctor } from "@/types/doctor";
import { useRouter } from "next/navigation";

import DoctorAvatar from "@/features/doctors/components/DoctorAvatar";
import SpecialtyIcon from "@/features/doctors/components/SpecialtyIcon";
import { getSpecialtyMeta } from "@/features/doctors/specialties";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();
  const specialtyMeta = getSpecialtyMeta(doctor.specialty);

  function handleDoctorAppointment() {
    router.push(`/booking?doctorId=${encodeURIComponent(doctor.id)}`);
  }

  return (
    <article className="schedula-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="relative h-44">
        <DoctorAvatar doctor={doctor} size="xl" className="h-full w-full" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-4 pt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">{doctor.name}</h2>
              <p className="mt-1 text-sm text-white/85">{doctor.specialty}</p>
            </div>

            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg ${specialtyMeta.iconBgClass} ${specialtyMeta.iconColorClass}`}
              aria-hidden="true"
              title={doctor.specialty}
            >
              <SpecialtyIcon specialty={doctor.specialty} className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Qualification</dt>
            <dd className="text-right font-medium">{doctor.qualification}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Experience</dt>
            <dd className="font-medium">{doctor.experienceYears} years</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Consultation</dt>
            <dd className="font-medium">₹{doctor.consultationFee}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
          <span
            className={`text-sm font-medium ${
              doctor.available ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            {doctor.available ? "Available today" : "Currently unavailable"}
          </span>

          <button
            type="button"
            disabled={!doctor.available}
            onClick={handleDoctorAppointment}
            className="schedula-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </article>
  );
}
