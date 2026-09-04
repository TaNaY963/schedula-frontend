import Link from "next/link";

export default function DoctorCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--brand-soft)] via-white to-[var(--accent-soft)] p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="schedula-eyebrow">For doctors</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)]">
              Are you a doctor?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
              Manage your availability, appointments, and patient care from one
              organized workspace built for clinical teams.
            </p>
          </div>

          <div className="mt-6 shrink-0 lg:mt-0">
            <Link
              href="/register?role=doctor"
              className="schedula-btn-primary"
            >
              Join as a Doctor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
