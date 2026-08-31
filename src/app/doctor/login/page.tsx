import Link from "next/link";
import DoctorLoginForm from "@/features/doctor-portal/components/DoctorLoginForm";

export default function DoctorLoginPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section
          className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
          aria-labelledby="doctor-login-title"
        >
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--brand)] font-serif text-2xl text-white">
              S
            </div>

            <h1
              id="doctor-login-title"
              className="mt-5 text-2xl font-semibold tracking-tight"
            >
              Doctor login
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Sign in to manage your appointments and availability.
            </p>
          </div>

          <div className="mt-8">
            <DoctorLoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            New doctor?{" "}
            <Link
              href="/doctor/register"
              className="font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}