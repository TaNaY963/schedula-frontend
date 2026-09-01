"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

function formatStatus(status: AppointmentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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

    if (!confirmed) {
      return;
    }

    updateAppointment(appointment.id, {
      status: "cancelled",
    });
  }

  function handleCancel(appointment: Appointment) {
    const confirmed = window.confirm(
      `Cancel the appointment with ${appointment.patientName}?`,
    );

    if (!confirmed) {
      return;
    }

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

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="border-b border-[var(--line)] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--brand)]">
                Doctor portal
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Appointments
              </h1>

              <p className="mt-2 text-[var(--muted)]">
                Manage your patient appointments and consultation schedule.
              </p>
            </div>

            <Link
              href="/doctor/dashboard"
              className="w-fit rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-4">
          <div className="flex flex-col gap-4">
            {/* Status tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    filter === item.value
                      ? "bg-[var(--brand)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Search and date */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appointment-search"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Search
                </label>

                <input
                  id="appointment-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search patient or reason..."
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-date"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Date
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--brand)]"
                />
              </div>
            </div>

            {(search || dateFilter || filter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDateFilter("");
                  setFilter("all");
                }}
                className="w-fit text-sm font-medium text-[var(--brand)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Appointment list */}
        <section
          className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
          aria-labelledby="appointments-heading"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div>
              <h2 id="appointments-heading" className="font-semibold">
                Appointment list
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {filteredAppointments.length} result
                {filteredAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {status === "loading" && (
            <div
              className="space-y-4 p-5"
              aria-busy="true"
              aria-label="Loading appointments"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-lg bg-stone-100"
                />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="p-10 text-center" role="alert">
              <p className="font-medium">
                We couldn&apos;t load appointments.
              </p>

              <button
                type="button"
                onClick={loadAppointments}
                className="mt-3 text-sm font-semibold text-[var(--brand)] underline"
              >
                Try again
              </button>
            </div>
          )}

          {status === "ready" && filteredAppointments.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium">
                No appointments match your filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDateFilter("");
                  setFilter("all");
                }}
                className="mt-2 text-sm font-semibold text-[var(--brand)]"
              >
                Show all appointments
              </button>
            </div>
          )}

          {status === "ready" && filteredAppointments.length > 0 && (
            <ul className="divide-y divide-[var(--line)]">
              {filteredAppointments.map((appointment) => {
                const isUpdating = updatingId === appointment.id;
                const past = isPastAppointment(appointment);

                return (
                  <li
                    key={appointment.id}
                    className="px-5 py-5 transition hover:bg-stone-50"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Main information */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          {/* Avatar */}
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
                                  appointment.status,
                                )}`}
                              >
                                {formatStatus(appointment.status)}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {appointment.reason || "General consultation"}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                              <span>
                                📅 {formatDate(appointment.date)}
                              </span>

                              <span>
                                🕐 {formatTime(appointment.startTime)} –{" "}
                                {formatTime(appointment.endTime)}
                              </span>

                              <span>
                                {appointment.type === "video"
                                  ? "🎥 Video consultation"
                                  : "🏥 In-person consultation"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <Link
                          href={`/doctor/appointments/${appointment.id}`}
                          className="w-fit rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
                        >
                          View Details →
                        </Link>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleConfirm(appointment)}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating ? "Updating..." : "Confirm"}
                            </button>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleDecline(appointment)}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {(appointment.status === "confirmed" ||
                          appointment.status === "upcoming") && (
                          <>
                            <Link
                              href={`/doctor/appointments/${appointment.id}/reschedule`}
                              className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            >
                              Reschedule
                            </Link>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleCancel(appointment)}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {(appointment.status === "confirmed" ||
                          appointment.status === "upcoming") &&
                          past && (
                            <>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleCompleted(appointment)
                                }
                                className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Mark Completed
                              </button>

                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleMissed(appointment)}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Mark Missed
                              </button>
                            </>
                          )}

                        {appointment.status === "completed" && (
                          <Link
                            href={`/doctor/appointments/${appointment.id}`}
                            className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
                          >
                            View Completed Details
                          </Link>
                        )}

                        {(appointment.status === "cancelled" ||
                          appointment.status === "missed") && (
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
      </div>
    </main>
  );
}




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type {
//   Appointment,
//   AppointmentStatus,
// } from "@/types/appointment";

// type ApiResponse = {
//   data: Appointment[];
// };

// type Filter = "all" | AppointmentStatus;

// const statusStyles: Record<AppointmentStatus, string> = {
//   confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
//   pending: "bg-amber-50 text-amber-800 ring-amber-200",
//   cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
// };

// export default function DoctorAppointmentsPage() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [filter, setFilter] = useState<Filter>("all");
//   const [status, setStatus] = useState<
//     "loading" | "ready" | "error"
//   >("loading");

//   useEffect(() => {
//     fetch("/api/appointments")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Unable to load appointments");
//         }

//         return response.json() as Promise<ApiResponse>;
//       })
//       .then(({ data }) => {
//         setAppointments(data);
//         setStatus("ready");
//       })
//       .catch(() => {
//         setStatus("error");
//       });
//   }, []);

//   const filteredAppointments = useMemo(() => {
//     if (filter === "all") {
//       return appointments;
//     }

//     return appointments.filter(
//       (appointment) => appointment.status === filter,
//     );
//   }, [appointments, filter]);

//   return (
//     <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
//       <div className="mx-auto max-w-6xl">
//         <header className="border-b border-[var(--line)] pb-6">
//           <p className="text-sm font-medium text-[var(--brand)]">
//             Doctor portal
//           </p>

//           <h1 className="mt-2 text-3xl font-semibold tracking-tight">
//             All Appointments
//           </h1>

//           <p className="mt-2 text-[var(--muted)]">
//             View and filter your patient appointments.
//           </p>
//         </header>

//         <section className="mt-8">
//           <div className="flex flex-wrap gap-2">
//             {(["all", "confirmed", "pending", "cancelled"] as Filter[]).map(
//               (item) => (
//                 <button
//                   key={item}
//                   type="button"
//                   onClick={() => setFilter(item)}
//                   className={`rounded-lg px-3 py-2 text-sm font-medium capitalize ${
//                     filter === item
//                       ? "bg-[var(--brand)] text-white"
//                       : "border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)]"
//                   }`}
//                 >
//                   {item}
//                 </button>
//               ),
//             )}
//           </div>
//         </section>

//         <section
//           className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
//           aria-labelledby="appointments-heading"
//         >
//           <h2 id="appointments-heading" className="sr-only">
//             Appointments
//           </h2>

//           {status === "loading" && (
//             <div
//               className="space-y-4 p-5"
//               aria-busy="true"
//               aria-label="Loading appointments"
//             >
//               {[1, 2, 3].map((item) => (
//                 <div
//                   key={item}
//                   className="h-20 animate-pulse rounded-lg bg-stone-100"
//                 />
//               ))}
//             </div>
//           )}

//           {status === "error" && (
//             <div className="p-8 text-center" role="alert">
//               <p className="font-medium">
//                 We couldn&apos;t load appointments.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => window.location.reload()}
//                 className="mt-3 text-sm font-semibold text-[var(--brand)] underline"
//               >
//                 Try again
//               </button>
//             </div>
//           )}

//           {status === "ready" &&
//             filteredAppointments.length === 0 && (
//               <div className="p-10 text-center">
//                 <p className="font-medium">
//                   No appointments match this filter.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() => setFilter("all")}
//                   className="mt-2 text-sm font-semibold text-[var(--brand)]"
//                 >
//                   Show all appointments
//                 </button>
//               </div>
//             )}

//           {status === "ready" &&
//             filteredAppointments.length > 0 && (
//               <ul className="divide-y divide-[var(--line)]">
//                 {filteredAppointments.map((appointment) => (
//                   <li
//                     key={appointment.id}
//                     className="grid gap-4 px-5 py-5 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center"
//                   >
//                     <time className="text-sm font-medium text-[var(--muted)]">
//                       {new Intl.DateTimeFormat("en", {
//                         hour: "numeric",
//                         minute: "2-digit",
//                       }).format(new Date(appointment.startsAt))}
//                     </time>

//                     <div>
//                       <p className="font-semibold">
//                         {appointment.patient.name}
//                       </p>

//                       <p className="mt-1 text-sm text-[var(--muted)]">
//                         {appointment.reason}
//                       </p>

//                       <p className="mt-1 text-sm text-[var(--muted)]">
//                         {appointment.durationMinutes} min ·{" "}
//                         {appointment.room}
//                       </p>
//                     </div>

//                     <span
//                       className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[appointment.status]}`}
//                     >
//                       {appointment.status}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//         </section>
//       </div>
//     </main>
//   );
// }