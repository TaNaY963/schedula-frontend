import Link from "next/link";

export default function UserNav() {
  return (
    <nav
      aria-label="User navigation"
      className="border-b border-[var(--line)] bg-white"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/doctors"
          className="font-semibold tracking-tight"
        >
          Schedula
        </Link>

        <div className="flex gap-4 text-sm">
          <Link
            href="/doctors"
            className="font-medium hover:text-[var(--brand)]"
          >
            Doctors
          </Link>

          <Link
            href="/booking"
            className="font-medium hover:text-[var(--brand)]"
          >
            Booking
          </Link>

          <Link
            href="/login"
            className="font-medium hover:text-[var(--brand)]"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}