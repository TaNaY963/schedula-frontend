import type { Doctor } from "@/types/doctor";
import { useRouter } from "next/navigation";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  function handleDoctorAppointment() {
    router.push("booking");
  }

  return (
    <article className="schedula-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start gap-4">
        <div
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] font-semibold text-[var(--brand-deep)]"
          aria-hidden="true"
        >
          {doctor.name
            .replace("Dr. ", "")
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-[var(--ink)]">{doctor.name}</h2>
          <p className="mt-1 text-sm font-medium text-[var(--brand)]">
            {doctor.specialty}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
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
    </article>
  );
}
