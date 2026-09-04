"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEMO_CREDENTIALS } from "@/lib/mock-data/accounts";
import LoginForm from "@/features/auth/components/LoginForm";
import RoleToggle from "@/features/auth/components/RoleToggle";
import { AUTH_REDIRECT_PARAM } from "@/features/auth/redirect";
import { parseAuthRole, roleQuery } from "@/features/auth/role";
import type { UserRole } from "@/context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-md animate-pulse">
            <div className="h-96 rounded-2xl bg-stone-200" />
          </div>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = parseAuthRole(searchParams.get("role"));
  const redirectTo = searchParams.get(AUTH_REDIRECT_PARAM);

  function handleRoleChange(nextRole: UserRole) {
    router.replace(`${pathname}${roleQuery(nextRole, redirectTo)}`);
  }

  return (
    <main className="schedula-auth-shell px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="schedula-auth-card" aria-labelledby="login-title">
          <div className="mb-8 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] text-2xl font-bold text-white shadow-[var(--shadow-brand)]">
              S
            </div>

            <h1
              id="login-title"
              className="mt-5 text-2xl font-bold tracking-tight text-[var(--ink)]"
            >
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {role === "doctor"
                ? "Sign in to manage appointments, calendar, and prescriptions."
                : redirectTo
                  ? "Please log in to book an appointment."
                  : "Sign in to book visits and manage your healthcare schedule."}
            </p>
          </div>

          {redirectTo && role === "user" && (
            <div className="mb-6 rounded-xl border border-[var(--line)] bg-[var(--brand-soft)]/40 px-4 py-3 text-sm text-[var(--muted)]">
              Sign in to continue booking your appointment.
            </div>
          )}

          <div className="mb-6">
            <p className="mb-2 text-sm font-medium">I am a</p>
            <RoleToggle value={role} onChange={handleRoleChange} />
          </div>

          <LoginForm key={role} role={role} redirectTo={redirectTo} />

          <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--brand-soft)]/40 p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--ink)]">Demo accounts</p>
            <p className="mt-2">
              Patient:{" "}
              <span className="font-medium text-[var(--ink)]">
                {DEMO_CREDENTIALS.patient.email}
              </span>{" "}
              / {DEMO_CREDENTIALS.patient.password}
            </p>
            <p className="mt-1">
              Doctor:{" "}
              <span className="font-medium text-[var(--ink)]">
                {DEMO_CREDENTIALS.doctor.email}
              </span>{" "}
              / {DEMO_CREDENTIALS.doctor.password}
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${roleQuery(role, redirectTo)}`}
              className="font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
            >
              Create account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Secure healthcare scheduling by Schedula
          </p>
        </section>
      </div>
    </main>
  );
}
