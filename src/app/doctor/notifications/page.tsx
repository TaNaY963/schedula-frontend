"use client";

import Link from "next/link";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import { useAuth } from "@/context/AuthContext";
import { useDoctorNotifications } from "@/features/notifications/DoctorNotificationsProvider";
import type { DoctorNotificationType } from "@/features/notifications/buildDoctorNotifications";

function notificationIcon(type: DoctorNotificationType) {
  switch (type) {
    case "appointment":
      return "📅";
    case "cancellation":
      return "✕";
    default:
      return "🔔";
  }
}

function formatNotificationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DoctorNotificationsPage() {
  const { user, isReady } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    isRead,
    markAsRead,
    markAllAsRead,
  } = useDoctorNotifications();

  if (!isReady || loading) {
    return (
      <PortalMain maxWidth="3xl">
        <div className="h-64 animate-pulse rounded-xl bg-stone-100" />
      </PortalMain>
    );
  }

  if (!user) {
    return (
      <PortalMain maxWidth="3xl">
        <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="font-medium">Please log in to view your notifications.</p>
        </div>
      </PortalMain>
    );
  }

  return (
    <PortalMain maxWidth="3xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Notifications"
        description="Stay updated on appointment requests and patient activity."
        action={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="schedula-btn-secondary shrink-0 whitespace-nowrap"
            >
              Mark all as read
            </button>
          ) : undefined
        }
      />

      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        {error ? (
          <div className="p-8 text-center text-sm text-red-600">{error}</div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y divide-[var(--line)]">
            {notifications.map((notification) => {
              const read = isRead(notification.id);

              return (
                <li key={notification.id}>
                  <Link
                    href={notification.href}
                    onClick={() => markAsRead(notification.id)}
                    className={`flex gap-4 p-5 transition hover:bg-stone-50 ${
                      read ? "opacity-70" : ""
                    }`}
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-lg">
                      {notificationIcon(notification.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-[var(--ink)]">
                          {notification.title}
                        </p>

                        {!read && (
                          <span className="shrink-0 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {formatNotificationDate(notification.date)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-[var(--muted)]">
            <p className="font-medium text-[var(--ink)]">No notifications yet</p>
            <p className="mt-2 text-sm">
              You&apos;ll see new booking requests and cancellations here.
            </p>
          </div>
        )}
      </section>
    </PortalMain>
  );
}
