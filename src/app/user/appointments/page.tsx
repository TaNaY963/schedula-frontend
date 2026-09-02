"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

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

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(status: AppointmentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";

    case "upcoming":
      return "bg-blue-50 text-blue-800 ring-blue-200";

    case "completed":
      return "bg-slate-100 text-slate-700 ring-slate-200";

    case "cancelled":
      return "bg-stone-100 text-stone-600 ring-stone-200";

    case "missed":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-gray-50 text-gray-700 ring-gray-200";
  }
}

export default function UserAppointmentsPage() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("upcoming");
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
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
  
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-[var(--line)] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--brand)]">
                Patient portal
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                My Appointments
              </h1>

              <p className="mt-2 text-[var(--muted)]">
                View and manage your appointments with doctors.
              </p>
            </div>

            <Link
              href="/doctors"
              className="w-fit rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Book Appointment
            </Link>
          </div>
        </header>

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
                  <Link
                    href={`/user/appointments/${appointment.id}`}
                    className="block"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
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
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                                appointment.status,
                              )}`}
                            >
                              {formatStatus(appointment.status)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {appointment.reason ||
                              "General consultation"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                            <span>
                              📅 {formatDate(appointment.date)}
                            </span>

                            <span>
                              🕐 {formatTime(appointment.startTime)}{" "}
                              – {formatTime(appointment.endTime)}
                            </span>

                            <span>
                              {appointment.type === "video"
                                ? "🎥 Video consultation"
                                : "🏥 In-person consultation"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
        </section>
      </div>
    </main>
  );
}