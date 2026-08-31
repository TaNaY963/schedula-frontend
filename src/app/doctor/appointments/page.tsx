"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

type ApiResponse = {
  data: Appointment[];
};

type Filter = "all" | AppointmentStatus;

const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    fetch("/api/appointments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load appointments");
        }

        return response.json() as Promise<ApiResponse>;
      })
      .then(({ data }) => {
        setAppointments(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const filteredAppointments = useMemo(() => {
    if (filter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === filter,
    );
  }, [appointments, filter]);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-[var(--line)] pb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Doctor portal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            All Appointments
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            View and filter your patient appointments.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {(["all", "confirmed", "pending", "cancelled"] as Filter[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium capitalize ${
                    filter === item
                      ? "bg-[var(--brand)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </section>

        <section
          className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
          aria-labelledby="appointments-heading"
        >
          <h2 id="appointments-heading" className="sr-only">
            Appointments
          </h2>

          {status === "loading" && (
            <div
              className="space-y-4 p-5"
              aria-busy="true"
              aria-label="Loading appointments"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-lg bg-stone-100"
                />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="p-8 text-center" role="alert">
              <p className="font-medium">
                We couldn&apos;t load appointments.
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-semibold text-[var(--brand)] underline"
              >
                Try again
              </button>
            </div>
          )}

          {status === "ready" &&
            filteredAppointments.length === 0 && (
              <div className="p-10 text-center">
                <p className="font-medium">
                  No appointments match this filter.
                </p>

                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-2 text-sm font-semibold text-[var(--brand)]"
                >
                  Show all appointments
                </button>
              </div>
            )}

          {status === "ready" &&
            filteredAppointments.length > 0 && (
              <ul className="divide-y divide-[var(--line)]">
                {filteredAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center"
                  >
                    <time className="text-sm font-medium text-[var(--muted)]">
                      {new Intl.DateTimeFormat("en", {
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(appointment.startsAt))}
                    </time>

                    <div>
                      <p className="font-semibold">
                        {appointment.patient.name}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {appointment.reason}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {appointment.durationMinutes} min ·{" "}
                        {appointment.room}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
        </section>
      </div>
    </main>
  );
}