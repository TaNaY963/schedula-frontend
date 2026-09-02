"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePatientNotifications } from "@/features/notifications/PatientNotificationsProvider";

const navItems = [
  {
    label: "Dashboard",
    href: "/user/dashboard",
  },
  {
    label: "Appointments",
    href: "/user/appointments",
  },
  {
    label: "Prescriptions",
    href: "/user/prescriptions",
  },
];

export default function UserNav() {
  const pathname = usePathname();
  const { unreadCount } = usePatientNotifications();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/user/appointments" ||
          item.href === "/user/prescriptions"
            ? pathname.startsWith(item.href)
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <Link
        href="/user/notifications"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        title="Notifications"
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition ${
          pathname === "/user/notifications"
            ? "bg-[var(--brand)] text-white shadow-sm"
            : "text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.6 1.09 5.454 1.31m5.715 0a24.255 24.255 0 0 1-5.715 0m5.715 0a3 3 0 1 1-5.715 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      <Link
        href="/user/profile"
        aria-label="Profile"
        title="Profile"
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          pathname === "/user/profile"
            ? "bg-[var(--brand)] text-white shadow-sm"
            : "text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
          />
        </svg>
      </Link>
    </nav>
  );
}
