"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type { EventClickArg, EventDropArg } from "@fullcalendar/core";

import type { Appointment } from "@/types/appointment";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";

type AppointmentResponse = {
    data: Appointment[];
};

type AvailabilityResponse = {
    data: AvailabilitySlot[];
};

const DOCTOR_ID = "doc-001";

const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800",
    confirmed: "bg-emerald-50 text-emerald-800",
    upcoming: "bg-blue-50 text-blue-800",
    completed: "bg-stone-100 text-stone-600",
    cancelled: "bg-stone-100 text-stone-600",
    missed: "bg-red-50 text-red-700",
};

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}

function appointmentDuration(appointment: Appointment) {
    return (
        timeToMinutes(appointment.endTime) -
        timeToMinutes(appointment.startTime)
    );
}

function combineDateAndTime(date: string, time: string) {
    return `${date}T${time}:00`;
}


export default function DoctorCalendarPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

    const [currentView, setCurrentView] = useState<
        "timeGridDay" | "timeGridWeek" | "dayGridMonth"
    >("timeGridWeek");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionError, setActionError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [calendarTitle, setCalendarTitle] = useState(
        "Calendar",
    );

    const [calendarRef, setCalendarRef] =
        useState<FullCalendar | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCalendarData() {
            try {
                const [
                    appointmentResponse,
                    availabilityResponse,
                ] = await Promise.all([
                    fetch("/api/appointments"),
                    fetch("/api/availability"),
                ]);

                if (
                    !appointmentResponse.ok ||
                    !availabilityResponse.ok
                ) {
                    throw new Error("Unable to load calendar data");
                }

                const appointmentData =
                    (await appointmentResponse.json()) as AppointmentResponse;

                const availabilityData =
                    (await availabilityResponse.json()) as AvailabilityResponse;

                if (cancelled) {
                    return;
                }

                const doctorAppointments =
                    appointmentData.data.filter(
                        (appointment) =>
                            appointment.doctorId === DOCTOR_ID,
                    );

                const doctorAvailability =
                    availabilityData.data.filter(
                        (slot) =>
                            slot.doctorId === DOCTOR_ID,
                    );

                setAppointments(doctorAppointments);
                setAvailability(doctorAvailability);
                setLoading(false);
            } catch (err) {
                console.error("CALENDAR LOAD ERROR:", err);

                if (!cancelled) {
                    setError("Unable to load calendar.");
                    setLoading(false);
                }
            }
        }

        loadCalendarData();

        return () => {
            cancelled = true;
        };
    }, []);

    const events = useMemo(() => {
        const appointmentEvents = appointments.map(
            (appointment) => ({
                id: appointment.id,
                title: appointment.patientName,
                start: combineDateAndTime(
                    appointment.date,
                    appointment.startTime,
                ),
                end: combineDateAndTime(
                    appointment.date,
                    appointment.endTime,
                ),
                editable:
                    appointment.status === "confirmed" ||
                    appointment.status === "upcoming",
                className: [
                    "schedula-appointment",
                    `status-${appointment.status}`,
                ],
                extendedProps: {
                    type: "appointment",
                    appointment,
                },
            }),
        );

        const availableEvents = availability
            .filter((slot) => {
                const slotStart = timeToMinutes(slot.startTime);
                const slotEnd = timeToMinutes(slot.endTime);

                const overlappingAppointment =
                    appointments.some((appointment) => {
                        if (
                            appointment.date !== slot.date ||
                            appointment.doctorId !== DOCTOR_ID
                        ) {
                            return false;
                        }

                        if (
                            appointment.status === "cancelled" ||
                            appointment.status === "completed" ||
                            appointment.status === "missed"
                        ) {
                            return false;
                        }

                        const appointmentStart =
                            timeToMinutes(appointment.startTime);

                        const appointmentEnd =
                            timeToMinutes(appointment.endTime);

                        return (
                            appointmentStart < slotEnd &&
                            appointmentEnd > slotStart
                        );
                    });

                return !overlappingAppointment;
            })
            .map((slot) => ({
                id: `availability-${slot.id}`,
                title: "Available",
                start: combineDateAndTime(
                    slot.date,
                    slot.startTime,
                ),
                end: combineDateAndTime(
                    slot.date,
                    slot.endTime,
                ),
                editable: false,
                className: "schedula-availability",
                extendedProps: {
                    type: "availability",
                    slot,
                },
            }));

        return [
            ...appointmentEvents,
            ...availableEvents,
        ];
    }, [appointments, availability]);

    function findValidAvailabilitySlot(
        appointment: Appointment,
        targetDate: string,
        targetStartTime: string,
    ) {
        const targetStart =
            timeToMinutes(targetStartTime);

        const duration =
            appointmentDuration(appointment);

        const targetEnd = targetStart + duration;

        return availability.find((slot) => {
            if (
                slot.doctorId !== DOCTOR_ID ||
                slot.date !== targetDate
            ) {
                return false;
            }

            const slotStart =
                timeToMinutes(slot.startTime);

            const slotEnd =
                timeToMinutes(slot.endTime);

            return (
                targetStart >= slotStart &&
                targetEnd <= slotEnd
            );
        });
    }

    async function handleEventDrop(
        info: EventDropArg,
    ) {
        const appointment =
            info.event.extendedProps
                .appointment as Appointment | undefined;

        if (!appointment || !info.event.start) {
            info.revert();
            return;
        }

        setActionError("");
        setActionMessage("");

        const newDate =
            formatDate(info.event.start);

        const newStartTime =
            formatTime(info.event.start);

        const duration =
            appointmentDuration(appointment);

        const newEndDate = info.event.end
            ? info.event.end
            : new Date(
                info.event.start.getTime() +
                duration * 60 * 1000,
            );

        const newEndTime =
            formatTime(newEndDate);

        const validSlot =
            findValidAvailabilitySlot(
                appointment,
                newDate,
                newStartTime,
            );

        if (!validSlot) {
            setActionError(
                "Please drop the appointment inside an available time slot.",
            );

            info.revert();
            return;
        }

        const conflict =
            appointments.some((existing) => {
                if (existing.id === appointment.id) {
                    return false;
                }

                if (
                    existing.doctorId !== DOCTOR_ID ||
                    existing.date !== newDate
                ) {
                    return false;
                }

                if (
                    existing.status === "cancelled" ||
                    existing.status === "completed" ||
                    existing.status === "missed"
                ) {
                    return false;
                }

                const existingStart =
                    timeToMinutes(existing.startTime);

                const existingEnd =
                    timeToMinutes(existing.endTime);

                const movedStart =
                    timeToMinutes(newStartTime);

                const movedEnd =
                    timeToMinutes(newEndTime);

                return (
                    movedStart < existingEnd &&
                    movedEnd > existingStart
                );
            });

        if (conflict) {
            setActionError(
                "This time conflicts with another appointment.",
            );

            info.revert();
            return;
        }

        try {
            const response = await fetch(
                "/api/appointments",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: appointment.id,
                        date: newDate,
                        startTime: newStartTime,
                        endTime: newEndTime,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "Unable to reschedule appointment.",
                );
            }

            setAppointments((current) =>
                current.map((item) =>
                    item.id === appointment.id
                        ? result.data
                        : item,
                ),
            );

            setActionMessage(
                `${appointment.patientName}'s appointment was rescheduled successfully.`,
            );
        } catch (err) {
            console.error(
                "RESCHEDULE ERROR:",
                err,
            );

            info.revert();

            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to reschedule appointment.",
            );
        }
    }

    function handleEventClick(info: EventClickArg) {
        const appointment =
            info.event.extendedProps
                .appointment as Appointment | undefined;

        if (!appointment) {
            return;
        }

        router.push(`/doctor/appointments/${appointment.id}`);
    }

    if (loading) {
        return (
            <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="h-8 w-64 animate-pulse rounded bg-stone-100" />

                    <div className="mt-6 h-[650px] animate-pulse rounded-xl bg-stone-100" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <header className="border-b border-[var(--line)] pb-6">
                    <Link
                        href="/doctor/dashboard"
                        className="text-sm font-medium text-[var(--brand)] hover:underline"
                    >
                        ← Doctor dashboard
                    </Link>

                    <p className="mt-5 text-sm font-medium text-[var(--brand)]">
                        Doctor portal
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Calendar
                    </h1>

                    <p className="mt-2 text-[var(--muted)]">
                        Manage appointments and view your availability.
                    </p>
                </header>

                <section className="mt-6 rounded-xl border border-[var(--line)] bg-white px-4 py-3">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Calendar navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => calendarRef?.getApi().today()}
                                className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                            >
                                Today
                            </button>

                            <div className="flex overflow-hidden rounded-lg border border-[var(--line)]">
                                <button
                                    type="button"
                                    onClick={() => calendarRef?.getApi().prev()}
                                    className="px-3 py-2 text-lg text-stone-600 transition hover:bg-stone-50"
                                    aria-label="Previous"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
                                    onClick={() => calendarRef?.getApi().next()}
                                    className="border-l border-[var(--line)] px-3 py-2 text-lg text-stone-600 transition hover:bg-stone-50"
                                    aria-label="Next"
                                >
                                    →
                                </button>
                            </div>

                            <h2 className="ml-2 text-base font-semibold text-stone-800">
                                {calendarTitle}
                            </h2>
                        </div>

                        {/* View selector */}
                        <div className="flex w-fit rounded-lg border border-[var(--line)] p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    calendarRef?.getApi().changeView("timeGridDay");
                                    setCurrentView("timeGridDay");
                                }}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition ${currentView === "timeGridDay"
                                    ? "bg-stone-900 text-white"
                                    : "text-stone-600 hover:bg-stone-50"
                                    }`}
                            >
                                Day
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    calendarRef?.getApi().changeView("timeGridWeek");
                                    setCurrentView("timeGridWeek");
                                }}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition ${currentView === "timeGridWeek"
                                    ? "bg-stone-900 text-white"
                                    : "text-stone-600 hover:bg-stone-50"
                                    }`}
                            >
                                Week
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    calendarRef?.getApi().changeView("dayGridMonth");
                                    setCurrentView("dayGridMonth");
                                }}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition ${currentView === "dayGridMonth"
                                    ? "bg-stone-900 text-white"
                                    : "text-stone-600 hover:bg-stone-50"
                                    }`}
                            >
                                Month
                            </button>
                        </div>
                    </div>
                </section>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-emerald-500" />
                        Appointment
                    </span>

                    <span className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-blue-400" />
                        Available
                    </span>
                </div>

                {actionMessage && (
                    <div
                        role="status"
                        className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    >
                        {actionMessage}
                    </div>
                )}

                {actionError && (
                    <div
                        role="alert"
                        className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {actionError}
                    </div>
                )}

                <section className="mt-5 overflow-hidden rounded-xl border border-[var(--line)] bg-white p-2 sm:p-4">
                    <FullCalendar
                        ref={(ref) => setCalendarRef(ref)}
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="timeGridWeek"
                        initialDate="2026-09-01"
                        headerToolbar={false}
                        events={events}
                        editable
                        eventDurationEditable={false}
                        eventStartEditable
                        droppable={false}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        slotDuration="00:30:00"
                        snapDuration="00:30:00"
                        eventMinHeight={45}
                        eventDisplay="block"
                        height="auto"
                        expandRows
                        nowIndicator
                        dayMaxEvents={3}
                        eventDrop={handleEventDrop}
                        eventClick={handleEventClick}
                        datesSet={(info) => {
                            setCalendarTitle(info.view.title);
                            setCurrentView(info.view.type as "timeGridDay" | "timeGridWeek" | "dayGridMonth");
                        }}
                        eventContent={(info) => {
                            const type = info.event.extendedProps.type;

                            if (type === "availability") {
                                return (
                                    <div className="flex h-full items-center px-2 py-1 text-xs font-medium text-blue-700">
                                        Available
                                    </div>
                                );
                            }

                            const appointment =
                                info.event.extendedProps.appointment as Appointment;

                            return (
                                <div
                                    className={`h-full w-full overflow-hidden rounded-md px-2 py-1 ${statusStyles[appointment.status] ??
                                        "bg-stone-100 text-stone-700"
                                        }`}
                                >
                                    <div className="flex h-full flex-col justify-center">
                                        <p className="truncate text-xs font-semibold leading-tight">
                                            {appointment.patientName}
                                        </p>

                                        <p className="mt-0.5 truncate text-[10px] leading-tight opacity-80">
                                            {appointment.startTime} – {appointment.endTime}
                                        </p>

                                        <span className="mt-0.5 truncate text-[10px] font-medium capitalize opacity-75">
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </section>
            </div>
        </main >
    );
}