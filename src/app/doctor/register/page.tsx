import Link from "next/link";
import DoctorRegistrationForm from "@/features/doctor-portal/components/DoctorRegistrationForm";

export default function DoctorRegistrationPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-deep)]"
          >
            ← Back to login
          </Link>

          <div className="mt-6">
            <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">
              S
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Doctor registration
            </h1>

            <p className="mt-2 max-w-xl text-[var(--muted)]">
              Create your doctor account by providing your personal,
              professional, contact, and account details.
            </p>
          </div>
        </header>

        <section
          className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-8"
          aria-labelledby="registration-form-title"
        >
          <h2 id="registration-form-title" className="sr-only">
            Doctor registration form
          </h2>

          <DoctorRegistrationForm />

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/doctor/login"
              className="font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
            >
              Doctor login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}