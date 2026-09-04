"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import TimeSlotSelect from "@/components/forms/TimeSlotSelect";
import type { TimeSlotInterval } from "@/lib/time-slot-options";
import type { Appointment } from "@/types/appointment";

type ApiResponse = {
  data: Appointment[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function RescheduleAppointmentPage({
  params,
}: Props) {
  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSlotInterval, setTimeSlotInterval] =
    useState<TimeSlotInterval>(15);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAppointment() {
      try {
        const { id } = await params;

        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load appointment");
        }

        const result = (await response.json()) as ApiResponse;

        const foundAppointment = result.data.find(
          (item) => item.id === id,
        );

        if (!foundAppointment) {
          throw new Error("Appointment not found");
        }

        if (!cancelled) {
          setAppointment(foundAppointment);
          setDate(foundAppointment.date);
          setStartTime(foundAppointment.startTime);
          setEndTime(foundAppointment.endTime);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load appointment",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAppointment();

    return () => {
      cancelled = true;
    };
  }, [params]);

  function hasConflict(
    appointments: Appointment[],
    currentAppointment: Appointment,
  ) {
    return appointments.some((existing) => {
      if (existing.id === currentAppointment.id) {
        return false;
      }

      if (existing.doctorId !== currentAppointment.doctorId) {
        return false;
      }

      if (
        existing.status === "cancelled" ||
        existing.status === "missed" ||
        existing.status === "completed"
      ) {
        return false;
      }

      if (existing.date !== date) {
        return false;
      }

      const existingStart = existing.startTime;
      const existingEnd = existing.endTime;

      return (
        startTime < existingEnd &&
        endTime > existingStart
      );
    });
  }

  async function handleReschedule(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!appointment) {
      return;
    }

    setError("");
    setMessage("");

    if (!date || !startTime || !endTime) {
      setError("Please select a date and time.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    const response = await fetch("/api/appointments");

    if (!response.ok) {
      setError("Unable to validate the appointment slot.");
      return;
    }

    const result = (await response.json()) as ApiResponse;

    if (hasConflict(result.data, appointment)) {
      setError(
        "This time slot is already booked. Please choose another slot.",
      );
      return;
    }

    try {
      setSaving(true);

      const updateResponse = await fetch(
        "/api/appointments",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: appointment.id,
            date,
            startTime,
            endTime,
            status: "upcoming",
          }),
        },
      );

      if (!updateResponse.ok) {
        throw new Error("Unable to reschedule appointment");
      }

      const updated = await updateResponse.json();

      setAppointment(updated.data);
      setMessage(
        "Appointment rescheduled successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reschedule appointment.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PortalMain maxWidth="3xl">
        <div className="h-8 w-56 animate-pulse rounded bg-stone-100" />
        <div className="mt-6 h-96 animate-pulse rounded-xl bg-stone-100" />
      </PortalMain>
    );
  }

  if (error && !appointment) {
    return (
      <PortalMain maxWidth="3xl">
        <PageHeader
          eyebrow="Doctor portal"
          title="Reschedule appointment"
          description="Choose a new date and time for the patient."
        />

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold">{error}</p>
        </div>
      </PortalMain>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <PortalMain maxWidth="3xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Reschedule appointment"
        description="Choose a new date and time for the patient."
      />

        {/* Current appointment */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-sm text-[var(--muted)]">
            Current appointment
          </p>

          <div className="mt-3">
            <p className="font-semibold">
              {appointment.patientName}
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {appointment.date} · {appointment.startTime} –{" "}
              {appointment.endTime}
            </p>
          </div>
        </section>

        {/* Reschedule form */}
        <form
          onSubmit={handleReschedule}
          className="mt-6 rounded-xl border border-[var(--line)] bg-white p-5"
        >
          <h2 className="font-semibold">
            Select new appointment time
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-2 block text-sm font-medium"
              >
                New date
              </label>

              <input
                id="appointment-date"
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="reschedule-interval"
                className="mb-2 block text-sm font-medium"
              >
                Time slot interval
              </label>

              <select
                id="reschedule-interval"
                value={timeSlotInterval}
                onChange={(event) => {
                  setTimeSlotInterval(
                    Number(event.target.value) as TimeSlotInterval,
                  );
                  setStartTime("");
                  setEndTime("");
                }}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] sm:max-w-xs"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <TimeSlotSelect
              id="start-time"
              label="Start time"
              value={startTime}
              intervalMinutes={timeSlotInterval}
              onChange={setStartTime}
              required
            />

            <TimeSlotSelect
              id="end-time"
              label="End time"
              value={endTime}
              intervalMinutes={timeSlotInterval}
              onChange={setEndTime}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div
              className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
              role="status"
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/doctor/appointments/${appointment.id}`}
              className="rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-medium hover:border-[var(--brand)]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Rescheduling..." : "Reschedule appointment"}
            </button>
          </div>
        </form>
    </PortalMain>
  );
}

