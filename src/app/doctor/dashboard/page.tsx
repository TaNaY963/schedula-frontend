// import Link from "next/link";

// const appointments = [
//   {
//     id: "apt-1042",
//     patient: "Maya Patel",
//     time: "09:00 AM",
//     reason: "Follow-up consultation",
//     status: "Confirmed",
//   },
//   {
//     id: "apt-1043",
//     patient: "Ethan Brooks",
//     time: "10:00 AM",
//     reason: "Annual wellness visit",
//     status: "Pending",
//   },
//   {
//     id: "apt-1044",
//     patient: "Sofia Chen",
//     time: "11:15 AM",
//     reason: "Skin consultation",
//     status: "Confirmed",
//   },
// ];

// export default function DoctorDashboardPage() {
//   return (
//     <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
//       <div className="mx-auto max-w-6xl">
//         <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">
//               S
//             </div>

//             <div>
//               <p className="text-lg font-semibold tracking-tight">
//                 Schedula
//               </p>
//               <p className="text-sm text-[var(--muted)]">
//                 Doctor portal
//               </p>
//             </div>
//           </div>

//           <p className="text-sm text-[var(--muted)]">
//             Welcome, Dr. Anika Rao
//           </p>
//         </header>

//         <section className="py-8">
//           <p className="text-sm font-medium text-[var(--brand)]">
//             Doctor dashboard
//           </p>

//           <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
//             Upcoming appointments
//           </h1>

//           <p className="mt-2 text-[var(--muted)]">
//             Review today&apos;s visits and manage your clinic schedule.
//           </p>
//         </section>

//         <section
//           className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
//           aria-label="Quick actions"
//         >
//           <Link
//             href="/doctor/profile"
//             className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--brand)]"
//           >
//             <p className="font-semibold">My Profile</p>
//             <p className="mt-1 text-sm text-[var(--muted)]">
//               View and update your doctor details and availability.
//             </p>
//           </Link>

//           <Link
//             href="/doctor/appointments"
//             className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--brand)]"
//           >
//             <p className="font-semibold">View All Appointments</p>
//             <p className="mt-1 text-sm text-[var(--muted)]">
//               See your complete appointment schedule.
//             </p>
//           </Link>
//         </section>

//         <section
//           className="mt-8 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
//           aria-labelledby="appointments-title"
//         >
//           <div className="border-b border-[var(--line)] px-5 py-4">
//             <h2 id="appointments-title" className="font-semibold">
//               Upcoming appointments
//             </h2>
//           </div>

//           <ul className="divide-y divide-[var(--line)]">
//             {appointments.map((appointment) => (
//               <li
//                 key={appointment.id}
//                 className="grid gap-3 px-5 py-5 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"
//               >
//                 <time className="text-sm font-medium text-[var(--muted)]">
//                   {appointment.time}
//                 </time>

//                 <div>
//                   <p className="font-semibold">{appointment.patient}</p>
//                   <p className="mt-1 text-sm text-[var(--muted)]">
//                     {appointment.reason}
//                   </p>
//                 </div>

//                 <span
//                   className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
//                     appointment.status === "Confirmed"
//                       ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
//                       : "bg-amber-50 text-amber-800 ring-amber-200"
//                   }`}
//                 >
//                   {appointment.status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       </div>
//     </main>
//   );
// }


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
    return type === "video" ? "Video consultation" : "In-person consultation";
  }

  function formatStatus(status: Appointment["status"]) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function getStatusClasses(status: Appointment["status"]) {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-800 ring-emerald-200";

      case "pending":
        return "bg-amber-50 text-amber-800 ring-amber-200";

      case "upcoming":
        return "bg-blue-50 text-blue-800 ring-blue-200";

      default:
        return "bg-gray-50 text-gray-700 ring-gray-200";
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <p className="text-sm text-[var(--muted)]">
            Welcome, Dr. Anika Rao
          </p>
        </header>

        {/* Page heading */}
        <section className="py-8">
          <p className="text-sm font-medium text-[var(--brand)]">
            Doctor dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upcoming appointments
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Review upcoming visits and manage your clinic schedule.
          </p>
        </section>

        {/* Quick actions */}
        <section
          className="grid gap-5 md:grid-cols-2"
          aria-label="Quick actions"
        >
          <Link
            href="/doctor/profile"
            className="rounded-xl border border-[var(--line)] bg-white p-5 transition hover:border-[var(--brand)] hover:shadow-sm"
          >
            <p className="font-semibold">My Profile</p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              View and update your doctor details and availability.
            </p>
          </Link>

          <Link
            href="/doctor/appointments"
            className="rounded-xl border border-[var(--line)] bg-white p-5 transition hover:border-[var(--brand)] hover:shadow-sm"
          >
            <p className="font-semibold">View All Appointments</p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              See your complete appointment schedule.
            </p>
          </Link>

          <Link
            href="/doctor/calendar"
            className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--brand)]"
          >
            <p className="font-semibold">Calendar</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              View appointments and manage your availability.
            </p>
          </Link>
        </section>

        {/* Appointments */}
        <section
          className="mt-8 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
          aria-labelledby="appointments-title"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div>
              <h2 id="appointments-title" className="font-semibold">
                Upcoming appointments
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Link
              href="/doctor/appointments"
              className="text-sm font-medium text-[var(--brand)] hover:underline"
            >
              View all
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
              Loading appointments...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-5 py-10 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && appointments.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-medium">No upcoming appointments</p>

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
                  className="px-5 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Appointment information */}
                    <div className="flex min-w-0 gap-4">
                      {/* Patient avatar */}
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-sm font-semibold text-[var(--brand)]">
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

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <span>
                            📅 {formatDate(appointment.date)}
                          </span>

                          <span>
                            🕐 {formatTime(appointment.startTime)} –{" "}
                            {formatTime(appointment.endTime)}
                          </span>

                          <span>
                            {appointment.type === "video" ? "🎥" : "🏥"}{" "}
                            {formatAppointmentType(appointment.type)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Link
                        href={`/doctor/appointments/${appointment.id}/patient`}
                        className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      >
                        👤 Patient Details
                      </Link>

                      <Link
                        href={`/doctor/calendar?appointment=${appointment.id}`}
                        className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                      >
                        🗓 Calendar
                      </Link>

                      <Link
                        href={`/doctor/appointments/${appointment.id}`}
                        className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

