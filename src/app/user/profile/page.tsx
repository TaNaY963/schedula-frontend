"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="font-medium">Please log in to view your profile.</p>

            <Link
              href="/login"
              className="mt-4 inline-block rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] p-6">
            <p className="text-sm font-medium text-[var(--brand)]">
              Patient portal
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Profile
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              View your account information.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-xl font-semibold text-[var(--brand)]">
                {initials}
              </div>

              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Patient
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--line)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  Full Name
                </p>

                <p className="mt-1 font-medium">
                  {user.name}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--line)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  Email
                </p>

                <p className="mt-1 font-medium break-all">
                  {user.email}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--line)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  Account Type
                </p>

                <p className="mt-1 font-medium">
                  Patient
                </p>
              </div>

              <div className="rounded-lg border border-[var(--line)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  User ID
                </p>

                <p className="mt-1 font-medium break-all">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}