import type { PortalNavItem } from "@/components/portal/types";

export const userNavItems: PortalNavItem[] = [
  { label: "Dashboard", href: "/user/dashboard" },
  { label: "Appointments", href: "/user/appointments", matchPrefix: true },
  { label: "Prescriptions", href: "/user/prescriptions", matchPrefix: true },
];

export const doctorNavItems: PortalNavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard" },
  { label: "Appointments", href: "/doctor/appointments", matchPrefix: true },
  { label: "Prescriptions", href: "/doctor/prescriptions", matchPrefix: true },
];
