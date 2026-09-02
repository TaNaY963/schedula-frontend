"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Appointment } from "@/types/appointment";

type ApiResponse = {
    data: Appointment[];
};

type Notification = {
    id: string;
    title: string;
    message: string;
    date: string;
    type: "appointment" | "reminder" | "status";
};

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );
}

export default function UserNotificationsPage() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAppointments() {
            try {
                const response = await fetch("/api/appointments");

                if (!response.ok) {
                    throw new Error("Unable to load notifications.");
                }

                const result = (await response.json()) as ApiResponse;

                setAppointments(result.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadAppointments();
    }, []);

    const notifications = useMemo<Notification[]>(() => {
        if (!user) {
            return [];
        }

        const userAppointments = appointments.filter(
            (appointment) => appointment.patientId === user.id,
        );

        const result: Notification[] = [];

        userAppointments.forEach((appointment) => {
            if (appointment.status === "pending") {
                result.push({
                    id: `${appointment.id}-pending`,
                    title: "Appointment awaiting confirmation",
                    message: `${appointment.doctorName} has received your appointment request for ${formatDate(
                        appointment.date,
                    )}.`,
                    date: appointment.createdAt,
                    type: "appointment",
                });
            }

            if (
                appointment.status === "confirmed" ||
                appointment.status === "upcoming"
            ) {
                result.push({
                    id: `${appointment.id}-confirmed`,
                    title: "Appointment confirmed",
                    message: `Your appointment with ${appointment.doctorName} on ${formatDate(
                        appointment.date,
                    )} has been confirmed.`,
                    date: appointment.updatedAt,
                    type: "status",
                });
            }

            if (appointment.status === "completed") {
                result.push({
                    id: `${appointment.id}-completed`,
                    title: "Appointment completed",
                    message: `Your appointment with ${appointment.doctorName} has been completed.`,
                    date: appointment.updatedAt,
                    type: "status",
                });
            }

            if (appointment.status === "cancelled") {
                result.push({
                    id: `${appointment.id}-cancelled`,
                    title: "Appointment cancelled",
                    message: `Your appointment with ${appointment.doctorName} has been cancelled.`,
                    date: appointment.updatedAt,
                    type: "status",
                });
            }

            if (appointment.status === "missed") {
                result.push({
                    id: `${appointment.id}-missed`,
                    title: "Appointment missed",
                    message: `You missed your appointment with ${appointment.doctorName}.`,
                    date: appointment.updatedAt,
                    type: "status",
                });
            }
        });

        return result.sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime(),
        );
    }, [appointments, user]);

    return (
        <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl">
            </div>
            <div className="mx-auto max-w-4xl">
                <header className="border-b border-[var(--line)] pb-6">
                    <p className="text-sm font-medium text-[var(--brand)]">
                        Patient portal
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Notifications
                    </h1>

                    <p className="mt-2 text-[var(--muted)]">
                        Stay updated about your appointments.
                    </p>
                </header>

                <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                    {loading ? (
                        <div className="space-y-4 p-5">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-20 animate-pulse rounded-lg bg-stone-100"
                                />
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        <ul className="divide-y divide-[var(--line)]">
                            {notifications.map((notification) => (
                                <li key={notification.id}>
                                    <Link
                                        href={
                                            notification.id.includes("-")
                                                ? `/user/appointments/${notification.id.split("-")[0]}`
                                                : "/user/appointments"
                                        }
                                        className="block p-5 transition hover:bg-stone-50"
                                    >
                                        <div className="flex gap-4">
                                            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-lg">
                                                {notification.type === "appointment"
                                                    ? "📅"
                                                    : notification.type === "status"
                                                        ? "✓"
                                                        : "🔔"}
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="font-semibold">
                                                    {notification.title}
                                                </h2>

                                                <p className="mt-1 text-sm text-[var(--muted)]">
                                                    {notification.message}
                                                </p>

                                                <p className="mt-2 text-xs text-[var(--muted)]">
                                                    {new Date(
                                                        notification.date,
                                                    ).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-10 text-center">
                            <div className="text-3xl">🔔</div>

                            <p className="mt-3 font-medium">
                                No notifications yet.
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                Appointment updates will appear here.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

