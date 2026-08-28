import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section
          className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
          aria-labelledby="login-title"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--brand)] font-serif text-2xl text-white">
              S
            </div>

            <h1
              id="login-title"
              className="mt-5 text-2xl font-semibold tracking-tight"
            >
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Sign in to manage your clinic appointments.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Schedula · Clinic operations
          </p>
        </section>
      </div>
    </main>
  );
}