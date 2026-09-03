"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  function formatAppointmentType(type: Appointment["type"]) {
    return type === "video"
      ? "Video consultation"
      : "In-person consultation";
  }

  function formatStatus(status: Appointment["status"]) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function getStatusClasses(status: Appointment["status"]) {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";

      case "pending":
        return "bg-amber-50 text-amber-700 ring-amber-200";

      case "upcoming":
        return "bg-blue-50 text-blue-700 ring-blue-200";

      default:
        return "bg-gray-50 text-gray-700 ring-gray-200";
    }
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
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <Link href="/doctor/dashboard" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">
              S
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">
                Schedula
              </p>

              <p className="text-sm text-[var(--muted)]">
                Doctor portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-full border border-[var(--line)] bg-white text-lg transition hover:border-[var(--brand)]"
            >
              ♧
            </button>

            <Link
              href="/doctor/profile"
              className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white py-1.5 pl-1.5 pr-4 transition hover:border-[var(--brand)]"
            >
              <div className="grid size-8 place-items-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">
                AR
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">Dr. Anika Rao</p>
                <p className="text-xs text-[var(--muted)]">
                  Doctor
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Welcome section */}
        <section className="py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--brand)]">
                Doctor dashboard
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Good morning, Dr. Anika
              </h1>

              <p className="mt-2 max-w-2xl text-[var(--muted)]">
                Here&apos;s an overview of your appointments and clinic
                schedule.
              </p>
            </div>

            <Link
              href="/doctor/calendar"
              className="inline-flex w-fit items-center rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Open calendar →
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Appointment statistics"
        >
          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Upcoming
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {appointments.length}
                </p>
              </div>

              <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[var(--brand)]">
                A
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Scheduled appointments
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
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

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
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

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
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

        {/* Quick Actions */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage your schedule and doctor profile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/doctor/calendar"
              className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[var(--brand)]">
                  C
                </div>

                <span className="text-lg text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]">
                  →
                </span>
              </div>

              <h3 className="mt-4 font-semibold">
                Manage Calendar
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                View appointments and manage your schedule.
              </p>
            </Link>

            <Link
              href="/doctor/appointments"
              className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  A
                </div>

                <span className="text-lg text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]">
                  →
                </span>
              </div>

              <h3 className="mt-4 font-semibold">
                All Appointments
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Review and manage your complete appointment schedule.
              </p>
            </Link>

            <Link
              href="/doctor/profile"
              className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-purple-50 text-purple-700">
                  P
                </div>

                <span className="text-lg text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]">
                  →
                </span>
              </div>

              <h3 className="mt-4 font-semibold">
                My Profile
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Update your professional details and availability.
              </p>
            </Link>
          </div>
        </section>

        {/* Upcoming appointments */}
        <section
          className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
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

            <Link
              href="/doctor/appointments"
              className="text-sm font-medium text-[var(--brand)] hover:underline"
            >
              View all →
            </Link>
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
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                              appointment.status
                            )}`}
                          >
                            {formatStatus(appointment.status)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {appointment.reason}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
                          <span>
                            {formatDate(appointment.date)}
                          </span>

                          <span>
                            {formatTime(appointment.startTime)} –{" "}
                            {formatTime(appointment.endTime)}
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
                        Patient details
                      </Link>

                      <Link
                        href={`/doctor/calendar?appointment=${appointment.id}`}
                        className="rounded-lg border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      >
                        Calendar
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

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </main>
  );
}