import Link from "next/link";

import { getRebookPath } from "@/features/booking/rebook";
import type { Appointment } from "@/types/appointment";

export default function RebookAppointmentLink({
  appointment,
  className = "rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]",
}: {
  appointment: Appointment;
  className?: string;
}) {
  return (
    <Link href={getRebookPath(appointment)} className={className}>
      Rebook
    </Link>
  );
}
