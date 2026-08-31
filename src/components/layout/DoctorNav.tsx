import Link from "next/link";

export default function DoctorNav() {
  return (
    <nav
      aria-label="Doctor navigation"
      className="border-b border-[var(--line)] bg-white"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/doctor/dashboard"
          className="font-semibold tracking-tight"
        >
          Schedula
        </Link>

        <div className="flex gap-4 text-sm">
          <Link
            href="/doctor/dashboard"
            className="font-medium hover:text-[var(--brand)]"
          >
            Dashboard
          </Link>

          <Link
            href="/doctor/profile"
            className="font-medium hover:text-[var(--brand)]"
          >
            Profile
          </Link>

          <Link
            href="/doctor/appointments"
            className="font-medium hover:text-[var(--brand)]"
          >
            Appointments
          </Link>

          <Link
            href="/doctor/login"
            className="font-medium hover:text-[var(--brand)]"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}