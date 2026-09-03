"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LoginForm from "@/features/auth/components/LoginForm";
import RoleToggle from "@/features/auth/components/RoleToggle";
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

  function handleRoleChange(nextRole: UserRole) {
    router.replace(`${pathname}${roleQuery(nextRole)}`);
  }

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
              {role === "doctor"
                ? "Sign in to manage appointments and availability."
                : "Sign in to book visits and view your prescriptions."}
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-sm font-medium">I am a</p>
            <RoleToggle value={role} onChange={handleRoleChange} />
          </div>

          <LoginForm key={role} role={role} />

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${roleQuery(role)}`}
              className="font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]"
            >
              Create account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Schedula · Clinic operations
          </p>
        </section>
      </div>
    </main>
  );
}
