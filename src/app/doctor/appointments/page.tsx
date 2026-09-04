"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import {
  formatAppointmentDate,
  formatAppointmentStatus,
  formatAppointmentTime,
  getAppointmentStatusClasses,
} from "@/lib/formatters/appointments";
import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

type ApiResponse = {
  data: Appointment[];
};

type Filter = "all" | AppointmentStatus;

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Missed", value: "missed" },
];

function isPastAppointment(appointment: Appointment) {
  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.endTime}:00`,
  );

  return appointmentDateTime < new Date();
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadAppointments() {
    try {
      setStatus("loading");

      const response = await fetch("/api/appointments");

      if (!response.ok) {
        throw new Error("Unable to load appointments");
      }

      const result = (await response.json()) as ApiResponse;

      setAppointments(result.data);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load appointments");
        }

        const result = (await response.json()) as ApiResponse;

        if (!cancelled) {
          setAppointments(result.data);
          setStatus("ready");
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    fetchAppointments();

    return () => {
      cancelled = true;
    };
  }, []);

  async function updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ) {
    try {
      setUpdatingId(id);

      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update appointment");
      }

      const result = await response.json();

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id ? result.data : appointment,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Unable to update appointment. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleConfirm(appointment: Appointment) {
    updateAppointment(appointment.id, {
      status: "confirmed",
    });
  }

  function handleDecline(appointment: Appointment) {
    const confirmed = window.confirm(
      `Decline the appointment with ${appointment.patientName}?`,
    );

    if (!confirmed) return;

    updateAppointment(appointment.id, {
      status: "cancelled",
    });
  }

  function handleCancel(appointment: Appointment) {
    const confirmed = window.confirm(
      `Cancel the appointment with ${appointment.patientName}?`,
    );

    if (!confirmed) return;

    updateAppointment(appointment.id, {
      status: "cancelled",
    });
  }

  function handleCompleted(appointment: Appointment) {
    updateAppointment(appointment.id, {
      status: "completed",
    });
  }

  function handleMissed(appointment: Appointment) {
    updateAppointment(appointment.id, {
      status: "missed",
    });
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesStatus =
        filter === "all" || appointment.status === filter;

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        appointment.patientName.toLowerCase().includes(searchValue) ||
        appointment.reason?.toLowerCase().includes(searchValue);

      const matchesDate =
        !dateFilter || appointment.date === dateFilter;

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [appointments, filter, search, dateFilter]);

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed" ||
      appointment.status === "upcoming",
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  function clearFilters() {
    setSearch("");
    setDateFilter("");
    setFilter("all");
  }

  const hasActiveFilters =
    search || dateFilter || filter !== "all";

  return (
    <PortalMain maxWidth="7xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Appointments"
        description="Manage your patient appointments and consultation schedule."
      />

        {/* Summary cards */}
        <section
          className="mt-8 grid gap-4 sm:grid-cols-3"
          aria-label="Appointment summary"
        >
          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">
              Total appointments
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {appointments.length}
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
              Across all statuses
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {pendingCount}
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
              Appointments awaiting action
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">
              Completed
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {completedCount}
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
              Successfully completed visits
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5">
          <div className="flex flex-col gap-5">

            {/* Filter heading */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">
                  Find appointments
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Filter by status, patient, reason, or date.
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit text-sm font-medium text-[var(--brand)] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Status filters */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Status
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {filters.map((item) => {
                  const count =
                    item.value === "all"
                      ? appointments.length
                      : appointments.filter(
                          (appointment) =>
                            appointment.status === item.value,
                        ).length;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                        filter === item.value
                          ? "bg-[var(--brand)] text-white"
                          : "border border-[var(--line)] bg-white text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      }`}
                    >
                      {item.label}

                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                          filter === item.value
                            ? "bg-white/15 text-white"
                            : "bg-[var(--canvas)] text-[var(--muted)]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search + date */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appointment-search"
                  className="mb-2 block text-sm font-medium"
                >
                  Search patients
                </label>

                <input
                  id="appointment-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search patient or reason..."
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Appointment date
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Appointment list */}
        <section
          className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
          aria-labelledby="appointments-heading"
        >
          {/* List header */}
          <div className="flex flex-col gap-2 border-b border-[var(--line)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2
                id="appointments-heading"
                className="text-lg font-semibold"
              >
                Appointment list
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Showing {filteredAppointments.length} result
                {filteredAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <span className="text-sm text-[var(--muted)]">
              {confirmedCount} active
            </span>
          </div>

          {/* Loading */}
          {status === "loading" && (
            <div
              className="space-y-4 p-5"
              aria-busy="true"
              aria-label="Loading appointments"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-xl bg-stone-100"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div
              className="p-12 text-center"
              role="alert"
            >
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
                !
              </div>

              <p className="mt-4 font-medium">
                We couldn&apos;t load appointments.
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Please try again.
              </p>

              <button
                type="button"
                onClick={loadAppointments}
                className="mt-4 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {status === "ready" &&
            filteredAppointments.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--canvas)] text-[var(--brand)]">
                  A
                </div>

                <p className="mt-4 font-medium">
                  No appointments found
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Try changing your filters or search terms.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-[var(--brand)] hover:underline"
                  >
                    Show all appointments
                  </button>
                )}
              </div>
            )}

          {/* Appointment list */}
          {status === "ready" &&
            filteredAppointments.length > 0 && (
              <ul className="divide-y divide-[var(--line)]">
                {filteredAppointments.map((appointment) => {
                  const isUpdating =
                    updatingId === appointment.id;

                  const past =
                    isPastAppointment(appointment);

                  const initials = appointment.patientName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <li
                      key={appointment.id}
                      className="px-5 py-6 transition hover:bg-stone-50/70 sm:px-6"
                    >
                      <div className="flex flex-col gap-5">

                        {/* Main appointment information */}
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          <div className="flex min-w-0 gap-4">
                            {/* Avatar */}
                            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-sm font-semibold text-[var(--brand)]">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">
                                  {appointment.patientName}
                                </p>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(
                                    appointment.status,
                                  )}`}
                                >
                                  {formatAppointmentStatus(
                                    appointment.status,
                                  )}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-[var(--muted)]">
                                {appointment.reason ||
                                  "General consultation"}
                              </p>

                              {/* Appointment metadata */}
                              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
                                <span>
                                  {formatAppointmentDate(
                                    appointment.date,
                                    "short",
                                  )}
                                </span>

                                <span>
                                  {formatAppointmentTime(
                                    appointment.startTime,
                                  )}{" "}
                                  –{" "}
                                  {formatAppointmentTime(
                                    appointment.endTime,
                                  )}
                                </span>

                                <span>
                                  {appointment.type === "video"
                                    ? "Video consultation"
                                    : "In-person consultation"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* View details */}
                          <Link
                            href={`/doctor/appointments/${appointment.id}`}
                            className="w-fit shrink-0 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                          >
                            View details →
                          </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4">

                          {appointment.status === "pending" && (
                            <>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleConfirm(
                                    appointment,
                                  )
                                }
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>

                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleDecline(
                                    appointment,
                                  )
                                }
                                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {(appointment.status ===
                            "confirmed" ||
                            appointment.status ===
                              "upcoming") &&
                            !past && (
                              <>
                                <Link
                                  href={`/doctor/appointments/${appointment.id}/reschedule`}
                                  className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                >
                                  Reschedule
                                </Link>

                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleCancel(
                                      appointment,
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                          {(appointment.status ===
                            "confirmed" ||
                            appointment.status ===
                              "upcoming") &&
                            past && (
                              <>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleCompleted(
                                      appointment,
                                    )
                                  }
                                  className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Mark completed"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleMissed(
                                      appointment,
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Mark missed
                                </button>
                              </>
                            )}

                          {appointment.status ===
                            "completed" && (
                            <Link
                              href={`/doctor/appointments/${appointment.id}`}
                              className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            >
                              View completed details
                            </Link>
                          )}

                          {(appointment.status ===
                            "cancelled" ||
                            appointment.status ===
                              "missed") && (
                            <span className="rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-600">
                              Read-only appointment
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
        </section>
    </PortalMain>
  );
}