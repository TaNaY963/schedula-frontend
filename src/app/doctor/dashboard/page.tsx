import Link from "next/link";

const appointments = [
  {
    id: "apt-1042",
    patient: "Maya Patel",
    time: "09:00 AM",
    reason: "Follow-up consultation",
    status: "Confirmed",
  },
  {
    id: "apt-1043",
    patient: "Ethan Brooks",
    time: "10:00 AM",
    reason: "Annual wellness visit",
    status: "Pending",
  },
  {
    id: "apt-1044",
    patient: "Sofia Chen",
    time: "11:15 AM",
    reason: "Skin consultation",
    status: "Confirmed",
  },
];

export default function DoctorDashboardPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
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

        <section className="py-8">
          <p className="text-sm font-medium text-[var(--brand)]">
            Doctor dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upcoming appointments
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Review today&apos;s visits and manage your clinic schedule.
          </p>
        </section>

        <section
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Quick actions"
        >
          <Link
            href="/doctor/profile"
            className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--brand)]"
          >
            <p className="font-semibold">My Profile</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              View and update your doctor details and availability.
            </p>
          </Link>

          <Link
            href="/doctor/appointments"
            className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--brand)]"
          >
            <p className="font-semibold">View All Appointments</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              See your complete appointment schedule.
            </p>
          </Link>
        </section>

        <section
          className="mt-8 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
          aria-labelledby="appointments-title"
        >
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h2 id="appointments-title" className="font-semibold">
              Upcoming appointments
            </h2>
          </div>

          <ul className="divide-y divide-[var(--line)]">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="grid gap-3 px-5 py-5 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <time className="text-sm font-medium text-[var(--muted)]">
                  {appointment.time}
                </time>

                <div>
                  <p className="font-semibold">{appointment.patient}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {appointment.reason}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    appointment.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-amber-50 text-amber-800 ring-amber-200"
                  }`}
                >
                  {appointment.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}