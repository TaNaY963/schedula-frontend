"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import RegisterForm from "@/features/auth/components/RegisterForm";
import RoleToggle from "@/features/auth/components/RoleToggle";
import { AUTH_REDIRECT_PARAM } from "@/features/auth/redirect";
import { parseAuthRole, roleQuery } from "@/features/auth/role";
import DoctorRegistrationForm from "@/features/doctor-portal/components/DoctorRegistrationForm";
import type { UserRole } from "@/context/AuthContext";

export default function RegisterPage() {
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
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = parseAuthRole(searchParams.get("role"));
  const redirectTo = searchParams.get(AUTH_REDIRECT_PARAM);
  const isDoctor = role === "doctor";

  function handleRoleChange(nextRole: UserRole) {
    router.replace(`${pathname}${roleQuery(nextRole, redirectTo)}`);
  }

  return (
    <main className="schedula-auth-shell px-4 py-8 sm:px-6">
      <div
        className={`mx-auto ${
          isDoctor
            ? "max-w-3xl"
            : "flex min-h-[calc(100vh-4rem)] max-w-md items-center"
        }`}
      >
        <section className="schedula-auth-card">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] text-2xl font-bold text-white shadow-[var(--shadow-brand)]">
              S
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--ink)]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {isDoctor
                ? "Register as a doctor to manage your clinic schedule."
                : "Register as a patient to book and track appointments."}
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-sm font-medium">I am a</p>
            <RoleToggle value={role} onChange={handleRoleChange} />
          </div>

          <div className="mt-8">
            {isDoctor ? (
              <DoctorRegistrationForm />
            ) : (
              <RegisterForm redirectTo={redirectTo} />
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href={`/login${roleQuery(role, redirectTo)}`}
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
