"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import RebookAppointmentLink from "@/features/booking/components/RebookAppointmentLink";
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentStatusClasses,
} from "@/lib/formatters/appointments";
import type { Appointment } from "@/types/appointment";
import type { Prescription } from "@/types/prescription";

type ApiResponse = {
    data: Appointment[];
};

export default function UserDashboardPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const [appointmentsResponse, prescriptionsResponse] =
                    await Promise.all([
                        fetch("/api/appointments"),
                        user
                            ? fetch(
                                  `/api/prescriptions?patientId=${encodeURIComponent(user.id)}`,
                              )
                            : Promise.resolve(null),
                    ]);

                if (!appointmentsResponse.ok) {
                    throw new Error("Unable to load appointments.");
                }

                const appointmentsResult =
                    (await appointmentsResponse.json()) as ApiResponse;

                setAppointments(appointmentsResult.data);

                if (prescriptionsResponse?.ok) {
                    const prescriptionsResult = await prescriptionsResponse.json();
                    setPrescriptions(prescriptionsResult.data ?? []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [user]);

    const userAppointments = useMemo(() => {
        if (!user) {
            return [];
        }

        return appointments.filter(
            (appointment) => appointment.patientId === user.id,
        );
    }, [appointments, user]);

    const upcomingAppointments = useMemo(() => {
        return userAppointments.filter(
            (appointment) =>
                appointment.status === "pending" ||
                appointment.status === "confirmed" ||
                appointment.status === "upcoming",
        );
    }, [userAppointments]);

    const completedAppointments = useMemo(() => {
        return userAppointments.filter(
            (appointment) => appointment.status === "completed",
        );
    }, [userAppointments]);

    const userPrescriptions = useMemo(() => {
        if (!user) {
            return [];
        }

        return prescriptions.filter(
            (prescription) => prescription.patientId === user.id,
        );
    }, [prescriptions, user]);

    const nextAppointment = upcomingAppointments[0];

    const recentAppointments = [...userAppointments]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <PortalMain maxWidth="6xl">
            <PageHeader
                eyebrow="Patient portal"
                title={`Welcome, ${firstName} 👋`}
                description="Manage your appointments and stay connected with your doctors."
            />

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="schedula-stat-card">
                        <p className="text-sm text-[var(--muted)]">
                            Upcoming appointments
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {loading ? "—" : upcomingAppointments.length}
                        </p>

                        <Link
                            href="/user/appointments"
                            className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                        >
                            View appointments →
                        </Link>
                    </div>

                    <div className="schedula-stat-card">
                        <p className="text-sm text-[var(--muted)]">
                            Completed appointments
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {loading ? "—" : completedAppointments.length}
                        </p>

                        <Link
                            href="/user/appointments?filter=completed"
                            className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                        >
                            View history →
                        </Link>
                    </div>

                    <div className="schedula-stat-card">
                        <p className="text-sm text-[var(--muted)]">
                            Prescriptions
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {loading ? "—" : userPrescriptions.length}
                        </p>

                        <Link
                            href="/user/prescriptions"
                            className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                        >
                            View prescriptions →
                        </Link>
                    </div>
                </section>

                {/* Next appointment */}
                <section className="mt-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Next Appointment
                        </h2>

                        <Link
                            href="/doctors"
                            className="text-sm font-semibold text-[var(--brand)] hover:underline"
                        >
                            Book appointment
                        </Link>
                    </div>

                    <div className="schedula-panel mt-4 p-6">
                        {loading ? (
                            <div className="h-28 animate-pulse rounded-lg bg-stone-100" />
                        ) : nextAppointment ? (
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-4">
                                    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--canvas)] font-semibold text-[var(--brand)]">
                                        {nextAppointment.doctorName
                                            .split(" ")
                                            .map((name) => name[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">
                                                {nextAppointment.doctorName}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(
                                                    nextAppointment.status,
                                                )}`}
                                            >
                                                {nextAppointment.status}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-[var(--muted)]">
                                            {nextAppointment.reason ||
                                                "General consultation"}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                                            <span>
                                                📅 {formatAppointmentDate(nextAppointment.date)}
                                            </span>

                                            <span>
                                                🕐 {formatAppointmentTime(nextAppointment.startTime)} –{" "}
                                                {formatAppointmentTime(nextAppointment.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/user/appointments/${nextAppointment.id}`}
                                    className="w-fit rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                >
                                    View Details →
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="font-medium">
                                    You don't have any upcoming appointments.
                                </p>

                                <Link
                                    href="/doctors"
                                    className="mt-3 inline-block rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
                                >
                                    Find a Doctor
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Recent appointments */}
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Recent Appointments
                        </h2>

                        <Link
                            href="/user/appointments"
                            className="text-sm font-semibold text-[var(--brand)] hover:underline"
                        >
                            View all →
                        </Link>
                    </div>

                    <div className="schedula-panel mt-4 overflow-hidden">
                        {loading ? (
                            <div className="space-y-3 p-5">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-16 animate-pulse rounded-lg bg-stone-100"
                                    />
                                ))}
                            </div>
                        ) : recentAppointments.length > 0 ? (
                            <ul className="divide-y divide-[var(--line)]">
                                {recentAppointments.map((appointment) => (
                                    <li
                                        key={appointment.id}
                                        className="flex flex-col gap-3 p-5 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <Link
                                            href={`/user/appointments/${appointment.id}`}
                                            className="min-w-0 flex-1"
                                        >
                                            <p className="font-medium">
                                                {appointment.doctorName}
                                            </p>

                                            <p className="mt-1 text-sm text-[var(--muted)]">
                                                {formatAppointmentDate(appointment.date)} ·{" "}
                                                {formatAppointmentTime(appointment.startTime)}
                                            </p>
                                        </Link>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAppointmentStatusClasses(
                                                    appointment.status,
                                                )}`}
                                            >
                                                {appointment.status}
                                            </span>

                                            {appointment.status === "completed" && (
                                                <RebookAppointmentLink
                                                    appointment={appointment}
                                                    className="text-sm font-semibold text-[var(--brand)] hover:underline"
                                                />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="font-medium">
                                    No appointment history yet.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
        </PortalMain>
    );
}

