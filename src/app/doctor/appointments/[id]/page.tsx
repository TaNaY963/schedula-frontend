"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import PrescriptionDetails from "@/features/prescriptions/components/PrescriptionDetails";
import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";
import type { Prescription } from "@/types/prescription";

type ApiResponse = {
  data: Appointment[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
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

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";

    case "pending":
      return "bg-amber-50 text-amber-800 ring-amber-200";

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

function isPastAppointment(appointment: Appointment) {
  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.endTime}:00`,
  );

  return appointmentDateTime < new Date();
}

export default function DoctorAppointmentDetailsPage({
  params,
}: Props) {
  const [appointmentId, setAppointmentId] = useState("");
  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [prescription, setPrescription] =
    useState<Prescription | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAppointment() {
      try {
        const { id } = await params;

        if (cancelled) {
          return;
        }

        setAppointmentId(id);

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

          const prescriptionsResponse = await fetch(
            `/api/prescriptions?appointmentId=${encodeURIComponent(foundAppointment.id)}`,
          );

          if (prescriptionsResponse.ok) {
            const prescriptionsResult = await prescriptionsResponse.json();
            setPrescription(prescriptionsResult.data?.[0] ?? null);
          }
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

  async function updateStatus(newStatus: AppointmentStatus) {
    if (!appointment) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointment.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update appointment");
      }

      const result = await response.json();

      setAppointment(result.data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update appointment",
      );
    } finally {
      setUpdating(false);
    }
  }

  function handleDecline() {
    if (!appointment) {
      return;
    }

    const confirmed = window.confirm(
      `Decline the appointment with ${appointment.patientName}?`,
    );

    if (!confirmed) {
      return;
    }

    updateStatus("cancelled");
  }

  function handleCancel() {
    if (!appointment) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel the appointment with ${appointment.patientName}?`,
    );

    if (!confirmed) {
      return;
    }

    updateStatus("cancelled");
  }

  if (loading) {
    return (
      <PortalMain maxWidth="4xl">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-100" />
        <div className="mt-6 h-80 animate-pulse rounded-xl bg-stone-100" />
      </PortalMain>
    );
  }

  if (error || !appointment) {
    return (
      <PortalMain maxWidth="4xl">
        <PageHeader
          eyebrow="Doctor portal"
          title="Appointment details"
          description="View and manage this appointment."
        />

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold">
            {error || "Appointment not found"}
          </p>
        </div>
      </PortalMain>
    );
  }

  const past = isPastAppointment(appointment);

  return (
    <PortalMain maxWidth="4xl">
      <PageHeader
        eyebrow="Doctor portal"
        title={appointment.patientName}
        description="Appointment details"
        action={
          <span
            className={`w-fit rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${getStatusClasses(
              appointment.status,
            )}`}
          >
            {appointment.status}
          </span>
        }
      />

        {/* Appointment information */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-semibold">
              Appointment information
            </h2>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--muted)]">Patient</p>
              <p className="mt-1 font-medium">
                {appointment.patientName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">Appointment ID</p>
              <p className="mt-1 font-medium">{appointment.id}</p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">Date</p>
              <p className="mt-1 font-medium">
                {formatDate(appointment.date)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">Time</p>
              <p className="mt-1 font-medium">
                {formatTime(appointment.startTime)} –{" "}
                {formatTime(appointment.endTime)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Appointment type
              </p>
              <p className="mt-1 font-medium">
                {appointment.type === "video"
                  ? "Video consultation"
                  : "In-person consultation"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Reason
              </p>
              <p className="mt-1 font-medium">
                {appointment.reason || "General consultation"}
              </p>
            </div>
          </div>
        </section>

        {/* Patient details */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-semibold">Patient details</h2>
          </div>

          <div className="p-5">
            <Link
              href={`/doctor/appointments/${appointment.id}/patient`}
              className="flex items-center gap-4 rounded-lg p-2 transition hover:bg-stone-50"
            >
              <div className="grid size-14 place-items-center rounded-full bg-[var(--canvas)] text-lg font-semibold text-[var(--brand)]">
                {appointment.patientName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-semibold">
                  {appointment.patientName}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Patient ID: {appointment.patientId}
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Prescription</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Prescription for this appointment.
              </p>
            </div>

            {prescription && (
              <Link
                href={`/doctor/prescriptions#prescription-${prescription.id}`}
                className="text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                View on prescriptions page →
              </Link>
            )}
          </div>

          <div className="p-6">
            {prescription ? (
              <PrescriptionDetails prescription={prescription} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                No prescription has been added for this appointment yet.
              </p>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-semibold">Appointment actions</h2>
          </div>

          <div className="flex flex-wrap gap-3 p-5">
            {/* Pending */}
            {appointment.status === "pending" && (
              <>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => updateStatus("confirmed")}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Confirm Appointment"}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={handleDecline}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Decline Appointment
                </button>
              </>
            )}

            {/* Confirmed / Upcoming */}
            {(appointment.status === "confirmed" ||
              appointment.status === "upcoming") &&
              !past && (
                <>
                  <Link
                    href={`/doctor/appointments/${appointmentId}/reschedule`}
                    className="rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    Reschedule
                  </Link>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={handleCancel}
                    className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}

            {/* Past confirmed/upcoming */}
            {(appointment.status === "confirmed" ||
              appointment.status === "upcoming") &&
              past && (
                <>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus("completed")}
                    className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    Mark as Completed
                  </button>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus("missed")}
                    className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Mark as Missed
                  </button>
                </>
              )}

            {/* Completed */}
            {appointment.status === "completed" && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Appointment completed.
                {appointment.prescriptionAvailable
                  ? " Prescription is available."
                  : " No prescription has been added yet."}
              </div>
            )}

            {/* Cancelled */}
            {appointment.status === "cancelled" && (
              <div className="rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-600">
                This appointment has been cancelled and is read-only.
              </div>
            )}

            {/* Missed */}
            {appointment.status === "missed" && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                This appointment was missed and is read-only.
              </div>
            )}
          </div>
        </section>
    </PortalMain>
  );
}

