"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BellIcon, ProfileIcon } from "@/components/portal/icons";
import LogoutButton from "@/components/portal/LogoutButton";
import type { PortalNavItem } from "@/components/portal/types";

type PortalNavProps = {
  items: PortalNavItem[];
  notificationsHref: string;
  profileHref: string;
  unreadCount?: number;
};

function isNavItemActive(pathname: string, item: PortalNavItem) {
  if (item.matchPrefix) {
    return pathname.startsWith(item.href);
  }

  return pathname === item.href;
}

export default function PortalNav({
  items,
  notificationsHref,
  profileHref,
  unreadCount = 0,
}: PortalNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-[var(--line)] bg-[#f8fbff] p-1">
      {items.map((item) => {
        const isActive = isNavItemActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition sm:px-4 ${
              isActive
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
                : "text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="mx-1 hidden h-6 w-px bg-[var(--line)] sm:block" />

      <Link
        href={notificationsHref}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        title="Notifications"
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
          pathname === notificationsHref
            ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
            : "text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"
        }`}
      >
        <BellIcon />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      <Link
        href={profileHref}
        aria-label="Profile"
        title="Profile"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
          pathname === profileHref
            ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
            : "text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"
        }`}
      >
        <ProfileIcon />
      </Link>

      <LogoutButton />
    </nav>
  );
}
