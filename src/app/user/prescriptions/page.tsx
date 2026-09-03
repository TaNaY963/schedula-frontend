"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import DownloadPrescriptionButton from "@/features/prescriptions/components/DownloadPrescriptionButton";
import PrescriptionDetails from "@/features/prescriptions/components/PrescriptionDetails";
import type { Prescription } from "@/types/prescription";

type ApiResponse = {
  data: Prescription[];
};

export default function UserPrescriptionsPage() {
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const patientId = user.id;

    async function loadPrescriptions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/prescriptions?patientId=${encodeURIComponent(patientId)}`,
        );

        if (!response.ok) {
          throw new Error("Unable to load prescriptions.");
        }

        const result = (await response.json()) as ApiResponse;

        if (!cancelled) {
          setPrescriptions(result.data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load prescriptions.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrescriptions();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const userPrescriptions = useMemo(() => {
    if (!user) {
      return [];
    }

    return prescriptions.filter(
      (prescription) => prescription.patientId === user.id,
    );
  }, [prescriptions, user]);

  if (!user) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="font-medium">
              Please log in to view your prescriptions.
            </p>

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

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-[var(--line)] pb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Patient portal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My Prescriptions
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Prescriptions written for you by your doctors.
          </p>
        </header>

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          {loading && (
            <div className="space-y-4 p-5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-lg bg-stone-100"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="p-10 text-center">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && userPrescriptions.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium">No prescriptions yet.</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                When a doctor writes a prescription for you, it will appear
                here.
              </p>
            </div>
          )}

          {!loading && !error && userPrescriptions.length > 0 && (
            <ul className="divide-y divide-[var(--line)]">
              {userPrescriptions.map((prescription) => (
                <li key={prescription.id} className="p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-semibold">
                        {prescription.doctorName}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {prescription.diagnosis}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <DownloadPrescriptionButton
                        prescription={prescription}
                      />

                      <Link
                        href={`/user/appointments/${prescription.appointmentId}`}
                        className="text-sm font-semibold text-[var(--brand)] hover:underline"
                      >
                        View appointment →
                      </Link>
                    </div>
                  </div>

                  <PrescriptionDetails prescription={prescription} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
