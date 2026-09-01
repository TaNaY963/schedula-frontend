import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--brand)] font-serif text-2xl text-white">
              S
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Register to book and manage your appointments.
            </p>
          </div>

          <div className="mt-8">
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}