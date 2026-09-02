import Link from "next/link";
import { notFound } from "next/navigation";

import { appointments } from "@/lib/mock-data/appointments";

type PatientDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = await params;

  // Find the appointment
  const appointment = appointments.find(
    (item) => item.id === id,
  );

  if (!appointment) {
    notFound();
  }

  // Find all appointments for this patient
  const patientAppointments = appointments.filter(
    (item) =>
      item.patientId === appointment.patientId,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Back */}
      <Link
        href={`/doctor/appointments/${appointment.id}`}
        className="text-sm text-[var(--brand)] hover:underline"
      >
        ← Back to appointment
      </Link>

      {/* Header */}
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">
          Patient Details
        </h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Patient information and appointment history
        </p>
      </div>

      {/* Patient profile */}
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

      {/* Patient information */}
      <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold">
            Patient information
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[var(--muted)]">
              Patient ID
            </p>

            <p className="mt-1 font-medium">
              {appointment.patientId}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)]">
              Patient Name
            </p>

            <p className="mt-1 font-medium">
              {appointment.patientName}
            </p>
          </div>
        </div>
      </section>

      {/* Appointment history */}
      <section className="mt-6 rounded-xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold">
            Appointment history
          </h2>
        </div>

        <div className="divide-y divide-[var(--line)]">
          {patientAppointments.map((item) => (
            <div
              key={item.id}
              className="p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">
                    {item.date}
                  </p>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.startTime} – {item.endTime}
                  </p>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.reason || "Consultation"}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium capitalize">
                    {item.status}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {item.type === "video"
                      ? "Video consultation"
                      : "In-person consultation"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}