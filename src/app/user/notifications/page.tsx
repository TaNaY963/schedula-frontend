"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { usePatientNotifications } from "@/features/notifications/PatientNotificationsProvider";
import type { PatientNotificationType } from "@/features/notifications/types";

function notificationIcon(type: PatientNotificationType) {
  switch (type) {
    case "appointment":
      return "📅";
    case "status":
      return "✓";
    case "prescription":
      return "💊";
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

export default function UserNotificationsPage() {
  const { user, isReady } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    isRead,
    markAsRead,
    markAllAsRead,
  } = usePatientNotifications();

  if (!isReady || loading) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-stone-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="font-medium">
              Please log in to view your notifications.
            </p>

            <Link
              href="/login"
              className="mt-4 inline-block rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-[var(--line)] pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--brand)]">
                Patient portal
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Notifications
              </h1>

              <p className="mt-2 text-[var(--muted)]">
                Stay updated about your appointments and prescriptions.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="w-fit text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          {error ? (
            <div className="p-10 text-center">
              <p className="font-medium">{error}</p>
            </div>
          ) : notifications.length > 0 ? (
            <ul className="divide-y divide-[var(--line)]">
              {notifications.map((notification) => {
                const read = isRead(notification.id);

                return (
                  <li key={notification.id}>
                    <Link
                      href={notification.href}
                      onClick={() => markAsRead(notification.id)}
                      className={`block p-5 transition hover:bg-stone-50 ${
                        read ? "bg-white" : "bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-lg">
                          {notificationIcon(notification.type)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold">
                              {notification.title}
                            </h2>

                            {!read && (
                              <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
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
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-10 text-center">
              <div className="text-3xl">🔔</div>

              <p className="mt-3 font-medium">No notifications yet.</p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Appointment and prescription updates will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
