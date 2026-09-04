"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import RebookAppointmentLink from "@/features/booking/components/RebookAppointmentLink";
import {
  formatAppointmentDate,
  formatAppointmentStatus,
  formatAppointmentTime,
  getAppointmentStatusClasses,
} from "@/lib/formatters/appointments";
import type { Appointment } from "@/types/appointment";

type ApiResponse = {
  data: Appointment[];
};

type Filter = "upcoming" | "completed" | "cancelled" | "missed";

const filters: { label: string; value: Filter }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Missed", value: "missed" },
];

function isFilter(value: string | null): value is Filter {
  return filters.some((item) => item.value === value);
}

export default function UserAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <PortalMain maxWidth="5xl">
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-xl bg-stone-100" />
            <div className="h-40 animate-pulse rounded-xl bg-stone-100" />
          </div>
        </PortalMain>
      }
    >
      <UserAppointmentsContent />
    </Suspense>
  );
}

function UserAppointmentsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>(() =>
    isFilter(filterParam) ? filterParam : "upcoming",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAppointments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load appointments.");
        }

        const result = (await response.json()) as ApiResponse;

        if (!cancelled) {
          setAppointments(result.data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load appointments.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isFilter(filterParam)) {
      setFilter(filterParam);
    }
  }, [filterParam]);

  const userAppointments = useMemo(() => {
    if (!user) {
      return [];
    }

    return appointments.filter(
      (appointment) => appointment.patientId === user.id,
    );
  }, [appointments, user]);

  const filteredAppointments = useMemo(() => {
    return userAppointments.filter((appointment) => {
      if (filter === "upcoming") {
        return (
          appointment.status === "pending" ||
          appointment.status === "confirmed" ||
          appointment.status === "upcoming"
        );
      }

      return appointment.status === filter;
    });
  }, [userAppointments, filter]);

  return (
    <PortalMain maxWidth="5xl">
      <PageHeader
        eyebrow="Patient portal"
        title="My Appointments"
        description="View and manage your appointments with doctors."
        action={
          <Link
            href="/doctors"
            className="w-fit rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Book Appointment
          </Link>
        }
      />

        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-4">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-[var(--brand)] text-white"
                    : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          {loading && (
            <div className="space-y-4 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-lg bg-stone-100"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="p-10 text-center">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredAppointments.length === 0 && (
              <div className="p-10 text-center">
                <p className="font-medium">
                  No {filter} appointments found.
                </p>

                {filter === "upcoming" && (
                  <Link
                    href="/doctors"
                    className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                  >
                    Find a doctor
                  </Link>
                )}
              </div>
            )}

          {!loading &&
            !error &&
            filteredAppointments.length > 0 && (
              <ul className="divide-y divide-[var(--line)]">
                {filteredAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="p-5 transition hover:bg-stone-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <Link
                        href={`/user/appointments/${appointment.id}`}
                        className="flex min-w-0 flex-1 gap-4"
                      >
                        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--canvas)] font-semibold text-[var(--brand)]">
                          {appointment.doctorName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold">
                              {appointment.doctorName}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(
                                appointment.status,
                              )}`}
                            >
                              {formatAppointmentStatus(appointment.status)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {appointment.reason ||
                              "General consultation"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                            <span>
                              📅 {formatAppointmentDate(appointment.date)}
                            </span>

                            <span>
                              🕐 {formatAppointmentTime(appointment.startTime)}{" "}
                              – {formatAppointmentTime(appointment.endTime)}
                            </span>

                            <span>
                              {appointment.type === "video"
                                ? "🎥 Video consultation"
                                : "🏥 In-person consultation"}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {appointment.status === "completed" && (
                        <RebookAppointmentLink
                          appointment={appointment}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </section>
    </PortalMain>
  );
}