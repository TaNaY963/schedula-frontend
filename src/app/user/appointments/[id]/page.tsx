"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import RebookAppointmentLink from "@/features/booking/components/RebookAppointmentLink";
import PrescriptionDetails from "@/features/prescriptions/components/PrescriptionDetails";
import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";
import type { Prescription } from "@/types/prescription";

type ApiResponse = {
  data: Appointment[];
};

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

export default function UserAppointmentDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [prescription, setPrescription] =
    useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppointment() {
      try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load appointment.");
        }

        const result = (await response.json()) as ApiResponse;

        const foundAppointment = result.data.find(
          (item) =>
            item.id === params.id &&
            item.patientId === user?.id,
        );

        if (!foundAppointment) {
          setError("Appointment not found.");
          return;
        }

        setAppointment(foundAppointment);

        const prescriptionsResponse = await fetch(
          `/api/prescriptions?appointmentId=${encodeURIComponent(
            foundAppointment.id,
          )}&patientId=${encodeURIComponent(foundAppointment.patientId)}`,
        );

        if (prescriptionsResponse.ok) {
          const prescriptionsResult = await prescriptionsResponse.json();
          setPrescription(prescriptionsResult.data?.[0] ?? null);
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load appointment.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadAppointment();
    }
  }, [params.id, user]);

  async function handleCancel() {
    if (!appointment) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointment.id,
          status: "cancelled",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to cancel appointment.",
        );
      }

      setAppointment(result.data);
      router.push("/user/appointments");
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment.",
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="h-64 animate-pulse rounded-xl bg-stone-100" />
        </div>
      </main>
    );
  }

  if (error || !appointment) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/user/appointments"
            className="text-sm font-medium text-[var(--brand)] hover:underline"
          >
            ← Back to My Appointments
          </Link>

          <div className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="font-medium">
              {error || "Appointment not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const canCancel =
    appointment.status === "pending" ||
    appointment.status === "confirmed" ||
    appointment.status === "upcoming";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/user/appointments"
          className="text-sm font-medium text-[var(--brand)] hover:underline"
        >
          ← Back to My Appointments
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] p-6">
            <p className="text-sm font-medium text-[var(--brand)]">
              Appointment Details
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">
                {appointment.doctorName}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                  appointment.status,
                )}`}
              >
                {formatStatus(appointment.status)}
              </span>
            </div>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {appointment.reason || "General consultation"}
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Date
              </p>
              <p className="mt-1 font-medium">
                {formatDate(appointment.date)}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Time
              </p>
              <p className="mt-1 font-medium">
                {formatTime(appointment.startTime)} –{" "}
                {formatTime(appointment.endTime)}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Consultation Type
              </p>
              <p className="mt-1 font-medium">
                {appointment.type === "video"
                  ? "Video consultation"
                  : "In-person consultation"}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Patient
              </p>
              <p className="mt-1 font-medium">
                {appointment.patientName}
              </p>
            </div>
          </div>

          {canCancel && (
            <div className="flex justify-end border-t border-[var(--line)] p-6">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel Appointment
              </button>
            </div>
          )}

          {appointment.status === "completed" && (
            <div className="flex justify-end border-t border-[var(--line)] p-6">
              <RebookAppointmentLink appointment={appointment} />
            </div>
          )}
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] p-6">
            <h2 className="text-xl font-semibold">Prescription</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Issued by your doctor for this appointment.
            </p>
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
      </div>
    </main>
  );
}

