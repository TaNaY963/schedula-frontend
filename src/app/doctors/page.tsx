"use client";

import { useEffect, useState } from "react";
import DoctorCard from "@/features/doctors/components/DoctorCard";
import { getDoctors } from "@/features/doctors/api/doctors";
import type { Doctor } from "@/types/doctor";

type Status = "loading" | "ready" | "error";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-[var(--line)] pb-7">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">
              S
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">Schedula</p>
              <p className="text-sm text-[var(--muted)]">
                Find a doctor
              </p>
            </div>
          </div>
        </header>

        <section className="py-8" aria-labelledby="doctors-title">
          <p className="text-sm font-medium text-[var(--brand)]">
            Our specialists
          </p>

          <h1
            id="doctors-title"
            className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Find a doctor
          </h1>

          <p className="mt-2 max-w-xl text-[var(--muted)]">
            Choose a doctor and book an appointment at a convenient time.
          </p>
        </section>

        {status === "loading" && (
          <div
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading doctors"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-xl bg-stone-200"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6" role="alert">
            <p className="font-medium text-red-800">
              We couldn&apos;t load the doctors.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && doctors.length === 0 && (
          <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="font-medium">No doctors are currently available.</p>
          </div>
        )}

        {status === "ready" && doctors.length > 0 && (
          <section
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Available doctors"
          >
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}