import type { AppointmentStatus } from "@/types/appointment";

type DateFormatStyle = "short" | "long";

export function formatAppointmentDate(
  date: string,
  style: DateFormatStyle = "long",
) {
  if (style === "short") {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatAppointmentTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatAppointmentStatus(status: AppointmentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getAppointmentStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "upcoming":
      return "bg-sky-50 text-sky-700 ring-sky-200";

    case "completed":
      return "bg-slate-100 text-slate-700 ring-slate-200";

    case "cancelled":
      return "bg-slate-50 text-slate-500 ring-slate-200";

    case "missed":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-slate-50 text-slate-600 ring-slate-200";
  }
}
