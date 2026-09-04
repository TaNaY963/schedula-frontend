"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
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

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = params.id;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPatientDetails() {
      try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load patient details.");
        }

        const result = (await response.json()) as ApiResponse;
        const foundAppointment = result.data.find(
          (item) => item.id === appointmentId,
        );

        if (!foundAppointment) {
          throw new Error("Appointment not found.");
        }

        const history = result.data
          .filter((item) => item.patientId === foundAppointment.patientId)
          .sort((first, second) => {
            const firstDate = new Date(
              `${first.date}T${first.startTime}:00`,
            ).getTime();
            const secondDate = new Date(
              `${second.date}T${second.startTime}:00`,
            ).getTime();

            return secondDate - firstDate;
          });

        if (!cancelled) {
          setAppointment(foundAppointment);
          setPatientAppointments(history);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load patient details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPatientDetails();
  }, [appointmentId]);

  const completedCount = useMemo(
    () =>
      patientAppointments.filter((item) => item.status === "completed").length,
    [patientAppointments],
  );

  if (loading) {
    return (
      <PortalMain maxWidth="6xl">
        <div className="h-8 w-56 animate-pulse rounded bg-stone-100" />
        <div className="mt-6 h-72 animate-pulse rounded-xl bg-stone-100" />
      </PortalMain>
    );
  }

  if (error || !appointment) {
    return (
      <PortalMain maxWidth="6xl">
        <PageHeader
          eyebrow="Doctor portal"
          title="Patient Details"
          description="Patient information and appointment history."
        />

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-700">
            {error || "Patient not found."}
          </p>
        </div>
      </PortalMain>
    );
  }

  return (
    <PortalMain maxWidth="6xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Patient Details"
        description="Patient information and appointment history."
        action={
          <Link
            href={`/doctor/appointments/${appointment.id}`}
            className="schedula-btn-secondary shrink-0 whitespace-nowrap"
          >
            Back to appointment
          </Link>
        }
      />

      <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-[var(--canvas)] text-xl font-semibold text-[var(--brand)]">
              {appointment.patientName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {appointment.patientName}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Patient ID: {appointment.patientId}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold">Patient information</h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--muted)]">Patient ID</p>
            <p className="mt-1 font-medium">{appointment.patientId}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)]">Patient name</p>
            <p className="mt-1 font-medium">{appointment.patientName}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)]">Total appointments</p>
            <p className="mt-1 font-medium">{patientAppointments.length}</p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)]">Completed visits</p>
            <p className="mt-1 font-medium">{completedCount}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold">Appointment history</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            All appointments for this patient, newest first.
          </p>
        </div>

        {patientAppointments.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--muted)]">
            No appointment history found for this patient.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {patientAppointments.map((item) => (
              <div key={item.id} className="p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {formatAppointmentDate(item.date)}
                      </p>

                      {item.id === appointment.id && (
                        <span className="rounded-full bg-[var(--canvas)] px-2 py-0.5 text-xs font-medium text-[var(--brand)]">
                          Current visit
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatAppointmentTime(item.startTime)} –{" "}
                      {formatAppointmentTime(item.endTime)}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {item.doctorName}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {item.reason || "Consultation"}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {item.type === "video"
                        ? "Video consultation"
                        : "In-person consultation"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(item.status)}`}
                    >
                      {formatAppointmentStatus(item.status)}
                    </span>

                    <Link
                      href={`/doctor/appointments/${item.id}`}
                      className="text-sm font-semibold text-[var(--brand)] hover:underline"
                    >
                      View appointment →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalMain>
  );
}
