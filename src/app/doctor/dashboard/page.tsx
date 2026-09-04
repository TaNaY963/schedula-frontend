"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import { CalendarIcon } from "@/components/portal/icons";
import {
  formatAppointmentDate,
  formatAppointmentStatus,
  formatAppointmentTime,
  getAppointmentStatusClasses,
} from "@/lib/formatters/appointments";
import type { Appointment } from "@/types/appointment";

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const result = await response.json();

        const upcomingAppointments = result.data
          .filter(
            (appointment: Appointment) =>
              appointment.status === "confirmed" ||
              appointment.status === "upcoming" ||
              appointment.status === "pending"
          )
          .sort((a: Appointment, b: Appointment) => {
            const first = `${a.date} ${a.startTime}`;
            const second = `${b.date} ${b.startTime}`;

            return first.localeCompare(second);
          });

        setAppointments(upcomingAppointments);
      } catch (err) {
        console.error(err);
        setError("Unable to load appointments.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  function formatAppointmentType(type: Appointment["type"]) {
    return type === "video"
      ? "Video consultation"
      : "In-person consultation";
  }

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed" ||
      appointment.status === "upcoming"
  ).length;

  const videoCount = appointments.filter(
    (appointment) => appointment.type === "video"
  ).length;

  return (
    <PortalMain maxWidth="7xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Good morning, Dr. Anika"
        description="Here's an overview of your appointments and clinic schedule."
      />

      <section
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Appointment statistics"
        >
          <div className="schedula-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Upcoming
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {appointments.length}
                </p>
              </div>

              <Link
                href="/doctor/calendar"
                aria-label="Open calendar"
                title="Open calendar"
                className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[var(--brand)] transition hover:bg-blue-100"
              >
                <CalendarIcon className="h-5 w-5" />
              </Link>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Scheduled appointments
            </p>
          </div>

          <div className="schedula-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {pendingCount}
                </p>
              </div>

              <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                P
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Need your attention
            </p>
          </div>

          <div className="schedula-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Confirmed
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {confirmedCount}
                </p>
              </div>

              <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                ✓
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Confirmed visits
            </p>
          </div>

          <div className="schedula-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Video visits
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {videoCount}
                </p>
              </div>

              <div className="grid size-10 place-items-center rounded-xl bg-purple-50 text-purple-700">
                V
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Online consultations
            </p>
          </div>
        </section>

        {/* Upcoming appointments */}
        <section
          className="schedula-panel mt-8 overflow-hidden"
          aria-labelledby="appointments-title"
        >
          <div className="flex flex-col gap-3 border-b border-[var(--line)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="appointments-title"
                className="text-lg font-semibold"
              >
                Upcoming appointments
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/doctor/calendar"
                aria-label="Open calendar"
                title="Open calendar"
                className="grid size-9 place-items-center rounded-lg border border-[var(--line)] text-[var(--brand)] transition hover:border-[var(--brand)] hover:bg-blue-50"
              >
                <CalendarIcon className="h-5 w-5" />
              </Link>

              <Link
                href="/doctor/appointments"
                className="text-sm font-medium text-[var(--brand)] hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-12 text-center text-sm text-[var(--muted)]">
              Loading appointments...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-5 py-12 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && appointments.length === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--canvas)] text-[var(--brand)]">
                A
              </div>

              <p className="mt-4 font-medium">
                No upcoming appointments
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Your upcoming appointments will appear here.
              </p>
            </div>
          )}

          {/* Appointment list */}
          {!loading && !error && appointments.length > 0 && (
            <ul className="divide-y divide-[var(--line)]">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="px-5 py-5 transition hover:bg-gray-50/70 sm:px-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* Patient */}
                    <div className="flex min-w-0 gap-4">
                      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-sm font-semibold text-[var(--brand)]">
                        {appointment.patientName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">
                            {appointment.patientName}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(
                              appointment.status
                            )}`}
                          >
                            {formatAppointmentStatus(appointment.status)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {appointment.reason}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
                          <span>
                            {formatAppointmentDate(appointment.date, "short")}
                          </span>

                          <span>
                            {formatAppointmentTime(appointment.startTime)} –{" "}
                            {formatAppointmentTime(appointment.endTime)}
                          </span>

                          <span>
                            {formatAppointmentType(appointment.type)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 xl:shrink-0">
                      <Link
                        href={`/doctor/appointments/${appointment.id}/patient`}
                        className="rounded-lg border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      >
                        Patient history
                      </Link>

                      <Link
                        href={`/doctor/calendar?appointment=${appointment.id}`}
                        aria-label="View on calendar"
                        title="View on calendar"
                        className="grid size-9 place-items-center rounded-lg border border-[var(--line)] bg-white text-[var(--brand)] transition hover:border-[var(--brand)] hover:bg-blue-50"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/doctor/appointments/${appointment.id}`}
                        className="rounded-lg bg-[var(--brand)] px-3.5 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

    </PortalMain>
  );
}