"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Appointment } from "@/types/appointment";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";

type ViewMode = "day" | "week" | "month";

type AppointmentResponse = {
data: Appointment[];
};

type AvailabilityResponse = {
data: AvailabilitySlot[];
};

const DOCTOR_ID = "doc-001";

const statusStyles: Record<string, string> = {
pending: "bg-amber-50 text-amber-800 ring-amber-200",
confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
upcoming: "bg-blue-50 text-blue-800 ring-blue-200",
completed: "bg-stone-100 text-stone-600 ring-stone-200",
cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
missed: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(date: Date) {
return date.toISOString().split("T")[0];
}

function formatDisplayDate(date: Date) {
return new Intl.DateTimeFormat("en-IN", {
day: "numeric",
month: "short",
year: "numeric",
}).format(date);
}

function getStartOfWeek(date: Date) {
const result = new Date(date);
const day = result.getDay();

result.setDate(result.getDate() - day);
result.setHours(0, 0, 0, 0);

return result;

}

function getWeekDates(date: Date) {
const start = getStartOfWeek(date);


return Array.from({ length: 7 }, (_, index) => {
    const result = new Date(start);
    result.setDate(start.getDate() + index);
    return result;
});


}

function getMonthDays(date: Date) {
const year = date.getFullYear();
const month = date.getMonth();


const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);

const startDay = firstDay.getDay();

return Array.from(
    { length: startDay + lastDay.getDate() },
    (_, index) => {
        if (index < startDay) {
            return null;
        }

        return new Date(year, month, index - startDay + 1);
    },
);


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

function addMinutesToTime(
time: string,
minutesToAdd: number,
) {
const total = timeToMinutes(time) + minutesToAdd;

const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");

const minutes = (total % 60)
    .toString()
    .padStart(2, "0");

return `${hours}:${minutes}`;

}

export default function DoctorCalendarPage() {
console.log("CALENDAR PAGE LOADED");

const [appointments, setAppointments] = useState<Appointment[]>([]);
const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

const [view, setView] = useState<ViewMode>("week");

const [selectedDate, setSelectedDate] = useState(
    new Date("2026-09-01T00:00:00"),
);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [actionError, setActionError] = useState("");
const [actionMessage, setActionMessage] = useState("");

const [draggedAppointment, setDraggedAppointment] =
    useState<Appointment | null>(null);

const [dragOverSlot, setDragOverSlot] =
    useState<string | null>(null);

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

            if (!cancelled) {
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

                console.log(
                    "LOADED APPOINTMENTS:",
                    doctorAppointments,
                );

                console.log(
                    "LOADED AVAILABILITY:",
                    doctorAvailability,
                );

                setAppointments(doctorAppointments);
                setAvailability(doctorAvailability);
                setLoading(false);
            }
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

const weekDates = useMemo(
    () => getWeekDates(selectedDate),
    [selectedDate],
);

const monthDays = useMemo(
    () => getMonthDays(selectedDate),
    [selectedDate],
);

function goToday() {
    setSelectedDate(new Date());
}

function goPrevious() {
    const next = new Date(selectedDate);

    if (view === "day") {
        next.setDate(next.getDate() - 1);
    }

    if (view === "week") {
        next.setDate(next.getDate() - 7);
    }

    if (view === "month") {
        next.setMonth(next.getMonth() - 1);
    }

    setSelectedDate(next);
}

function goNext() {
    const next = new Date(selectedDate);

    if (view === "day") {
        next.setDate(next.getDate() + 1);
    }

    if (view === "week") {
        next.setDate(next.getDate() + 7);
    }

    if (view === "month") {
        next.setMonth(next.getMonth() + 1);
    }

    setSelectedDate(next);
}

const title = useMemo(() => {
    if (view === "day") {
        return formatDisplayDate(selectedDate);
    }

    if (view === "month") {
        return new Intl.DateTimeFormat("en-IN", {
            month: "long",
            year: "numeric",
        }).format(selectedDate);
    }

    const first = weekDates[0];
    const last = weekDates[6];

    return `${new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
    }).format(first)} – ${new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(last)}`;
}, [selectedDate, view, weekDates]);

function getAppointmentsForDate(date: Date) {
    const dateString = formatDate(date);

    return appointments.filter(
        (appointment) =>
            appointment.date === dateString &&
            appointment.doctorId === DOCTOR_ID,
    );
}

function getAvailabilityForDate(date: Date) {
    const dateString = formatDate(date);

    return availability.filter(
        (slot) =>
            slot.date === dateString &&
            slot.doctorId === DOCTOR_ID,
    );
}

/*
 * IMPORTANT:
 * This function removes an availability slot if any active
 * appointment overlaps with that slot.
 *
 * Example:
 *
 * Availability: 11:00 - 11:30
 * Appointment:  11:00 - 11:30
 *
 * Result:
 * The availability slot will NOT be displayed.
 */
function getAvailableSlotsForDate(date: Date) {
    const dayAppointments =
        getAppointmentsForDate(date);

    const dayAvailability =
        getAvailabilityForDate(date);

    return dayAvailability.filter((slot) => {
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);

        const appointmentOverlaps =
            dayAppointments.some((appointment) => {
                if (
                    appointment.status === "cancelled" ||
                    appointment.status === "completed" ||
                    appointment.status === "missed"
                ) {
                    return false;
                }

                const appointmentStart =
                    timeToMinutes(
                        appointment.startTime,
                    );

                const appointmentEnd =
                    timeToMinutes(
                        appointment.endTime,
                    );

                return (
                    appointmentStart < slotEnd &&
                    appointmentEnd > slotStart
                );
            });

        return !appointmentOverlaps;
    });
}

async function rescheduleAppointment(
    appointment: Appointment,
    slot: AvailabilitySlot,
) {
    setActionError("");
    setActionMessage("");

    const duration =
        appointmentDuration(appointment);

    const slotStart =
        timeToMinutes(slot.startTime);

    const slotEnd =
        timeToMinutes(slot.endTime);

    if (slotEnd - slotStart < duration) {
        setActionError(
            "This availability slot is too short for the appointment.",
        );
        return;
    }

    const conflict = appointments.some(
        (existing) => {
            if (existing.id === appointment.id) {
                return false;
            }

            if (
                existing.doctorId !== DOCTOR_ID
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

            if (
                existing.date !== slot.date
            ) {
                return false;
            }

            const existingStart =
                timeToMinutes(
                    existing.startTime,
                );

            const existingEnd =
                timeToMinutes(
                    existing.endTime,
                );

            return (
                slotStart < existingEnd &&
                slotEnd > existingStart
            );
        },
    );

    if (conflict) {
        setActionError(
            "This slot conflicts with another appointment.",
        );
        return;
    }

    try {
        console.log(
            "RESCHEDULING:",
            appointment.id,
            "TO:",
            slot.date,
            slot.startTime,
            slot.endTime,
        );

        const response = await fetch(
            "/api/appointments",
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    id: appointment.id,
                    date: slot.date,
                    startTime:
                        slot.startTime,
                    endTime:
                        addMinutesToTime(
                            slot.startTime,
                            duration,
                        ),
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

        console.log(
            "UPDATED APPOINTMENT:",
            result.data.id,
            result.data.date,
            result.data.startTime,
            result.data.endTime,
        );

        /*
         * Update local appointment state.
         * This immediately moves Rahul in the UI.
         */
        setAppointments((current) =>
            current.map((item) =>
                item.id === appointment.id
                    ? result.data
                    : item,
            ),
        );

        /*
         * IMPORTANT:
         * We do NOT remove the availability object.
         *
         * Instead, getAvailableSlotsForDate()
         * automatically hides it because the
         * appointment now occupies that time.
         */

        setActionMessage(
            `${appointment.patientName}'s appointment was rescheduled successfully.`,
        );
    } catch (err) {
        console.error(
            "RESCHEDULE ERROR:",
            err,
        );

        setActionError(
            err instanceof Error
                ? err.message
                : "Unable to reschedule appointment.",
        );
    }
}

if (loading) {
    return (
        <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="h-8 w-64 animate-pulse rounded bg-stone-100" />

                <div className="mt-6 h-[600px] animate-pulse rounded-xl bg-stone-100" />
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

            {/* Header */}
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

            {/* Calendar controls */}
            <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex flex-wrap items-center gap-2">

                        <button
                            type="button"
                            onClick={goPrevious}
                            className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)]"
                            aria-label="Previous"
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={goToday}
                            className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)]"
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium hover:border-[var(--brand)]"
                            aria-label="Next"
                        >
                            →
                        </button>

                        <h2 className="ml-2 text-lg font-semibold">
                            {title}
                        </h2>
                    </div>

                    <div className="flex rounded-lg border border-[var(--line)] p-1">
                        {(
                            [
                                "day",
                                "week",
                                "month",
                            ] as ViewMode[]
                        ).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    setView(item)
                                }
                                className={`rounded-md px-3 py-2 text-sm font-medium capitalize ${
                                    view === item
                                        ? "bg-[var(--brand)] text-white"
                                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legend */}
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

            {/* Success message */}
            {actionMessage && (
                <div
                    role="status"
                    className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    {actionMessage}
                </div>
            )}

            {/* Error message */}
            {actionError && (
                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {actionError}
                </div>
            )}

            {/* ========================= */}
            {/* DAY VIEW */}
            {/* ========================= */}

            {view === "day" && (
                <section className="mt-5 overflow-hidden rounded-xl border border-[var(--line)] bg-white">

                    <div className="border-b border-[var(--line)] p-5">
                        <p className="text-sm text-[var(--muted)]">
                            {new Intl.DateTimeFormat(
                                "en-IN",
                                {
                                    weekday: "long",
                                },
                            ).format(selectedDate)}
                        </p>

                        <h2 className="mt-1 text-xl font-semibold">
                            {formatDisplayDate(
                                selectedDate,
                            )}
                        </h2>
                    </div>

                    <div className="divide-y divide-[var(--line)]">

                        {/* Appointments */}
                        {getAppointmentsForDate(
                            selectedDate,
                        ).map((appointment) => (
                            <div
                                key={appointment.id}
                                draggable={
                                    appointment.status ===
                                        "confirmed" ||
                                    appointment.status ===
                                        "upcoming"
                                }
                                onDragStart={(
                                    event,
                                ) => {
                                    console.log(
                                        "DRAG STARTED:",
                                        appointment.id,
                                    );

                                    event.dataTransfer.effectAllowed =
                                        "move";

                                    event.dataTransfer.setData(
                                        "text/plain",
                                        appointment.id,
                                    );

                                    setDraggedAppointment(
                                        appointment,
                                    );
                                }}
                                onDragEnd={() => {
                                    console.log(
                                        "DRAG ENDED",
                                    );

                                    setDraggedAppointment(
                                        null,
                                    );

                                    setDragOverSlot(
                                        null,
                                    );
                                }}
                                className="cursor-grab p-5 hover:bg-stone-50 active:cursor-grabbing"
                            >
                                <Link
                                    href={`/doctor/appointments/${appointment.id}`}
                                    className="block"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="font-semibold">
                                                {
                                                    appointment.startTime
                                                }{" "}
                                                –{" "}
                                                {
                                                    appointment.endTime
                                                }
                                            </p>

                                            <p className="mt-1">
                                                {
                                                    appointment.patientName
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-[var(--muted)]">
                                                {
                                                    appointment.reason
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
                                                statusStyles[
                                                    appointment
                                                        .status
                                                ]
                                            }`}
                                        >
                                            {
                                                appointment.status
                                            }
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}

                        {/* Available slots */}
                        {getAvailableSlotsForDate(
                            selectedDate,
                        ).map((slot) => (
                            <div
                                key={slot.id}
                                onDragOver={(event) => {
                                    event.preventDefault();

                                    console.log(
                                        "DRAG OVER SLOT:",
                                        slot.id,
                                    );

                                    setDragOverSlot(
                                        slot.id,
                                    );
                                }}
                                onDragLeave={() => {
                                    setDragOverSlot(
                                        null,
                                    );
                                }}
                                onDrop={async (
                                    event,
                                ) => {
                                    event.preventDefault();

                                    console.log(
                                        "DROP EVENT FIRED",
                                    );

                                    console.log(
                                        "Dragged appointment:",
                                        draggedAppointment,
                                    );

                                    console.log(
                                        "Target slot:",
                                        slot,
                                    );

                                    if (
                                        !draggedAppointment
                                    ) {
                                        console.log(
                                            "NO DRAGGED APPOINTMENT",
                                        );
                                        return;
                                    }

                                    await rescheduleAppointment(
                                        draggedAppointment,
                                        slot,
                                    );

                                    setDraggedAppointment(
                                        null,
                                    );

                                    setDragOverSlot(
                                        null,
                                    );
                                }}
                                className={`border-l-4 border-blue-400 p-5 transition ${
                                    dragOverSlot ===
                                    slot.id
                                        ? "bg-blue-100 ring-2 ring-blue-400"
                                        : "bg-blue-50/40"
                                }`}
                            >
                                <p className="font-semibold">
                                    {slot.startTime} –{" "}
                                    {slot.endTime}
                                </p>

                                <p className="mt-1 text-sm text-blue-700">
                                    Available for booking
                                </p>

                                {slot.recurring && (
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Recurs{" "}
                                        {
                                            slot.recurrence
                                        }
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Empty state */}
                        {getAppointmentsForDate(
                            selectedDate,
                        ).length === 0 &&
                            getAvailableSlotsForDate(
                                selectedDate,
                            ).length === 0 && (
                                <div className="p-10 text-center text-sm text-[var(--muted)]">
                                    No appointments or availability for this day.
                                </div>
                            )}
                    </div>
                </section>
            )}

            {/* ========================= */}
            {/* WEEK VIEW */}
            {/* ========================= */}

            {view === "week" && (
                <section className="mt-5 overflow-x-auto rounded-xl border border-[var(--line)] bg-white">

                    <div className="grid min-w-[900px] grid-cols-7">

                        {weekDates.map((date) => {
                            const dayAppointments =
                                getAppointmentsForDate(
                                    date,
                                );

                            const dayAvailability =
                                getAvailableSlotsForDate(
                                    date,
                                );

                            return (
                                <div
                                    key={formatDate(
                                        date,
                                    )}
                                    className="min-h-[500px] border-r border-[var(--line)] last:border-r-0"
                                >
                                    <div className="border-b border-[var(--line)] p-3 text-center">

                                        <p className="text-xs font-medium uppercase text-[var(--muted)]">
                                            {new Intl.DateTimeFormat(
                                                "en-IN",
                                                {
                                                    weekday:
                                                        "short",
                                                },
                                            ).format(
                                                date,
                                            )}
                                        </p>

                                        <p className="mt-1 text-lg font-semibold">
                                            {date.getDate()}
                                        </p>
                                    </div>

                                    <div className="space-y-3 p-3">

                                        {/* Appointments */}
                                        {dayAppointments.map(
                                            (
                                                appointment,
                                            ) => (
                                                <Link
                                                    key={
                                                        appointment.id
                                                    }
                                                    href={`/doctor/appointments/${appointment.id}`}
                                                    className="block rounded-lg border border-emerald-200 bg-emerald-50 p-3 hover:border-[var(--brand)]"
                                                >
                                                    <p className="text-xs font-semibold text-emerald-800">
                                                        {
                                                            appointment.startTime
                                                        }{" "}
                                                        –{" "}
                                                        {
                                                            appointment.endTime
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold">
                                                        {
                                                            appointment.patientName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs capitalize text-[var(--muted)]">
                                                        {
                                                            appointment.status
                                                        }
                                                    </p>
                                                </Link>
                                            ),
                                        )}

                                        {/* Available slots */}
                                        {dayAvailability.map(
                                            (slot) => (
                                                <div
                                                    key={
                                                        slot.id
                                                    }
                                                    className="rounded-lg border border-blue-200 bg-blue-50 p-3"
                                                >
                                                    <p className="text-xs font-semibold text-blue-800">
                                                        {
                                                            slot.startTime
                                                        }{" "}
                                                        –{" "}
                                                        {
                                                            slot.endTime
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-blue-700">
                                                        Available
                                                    </p>
                                                </div>
                                            ),
                                        )}

                                        {dayAppointments.length ===
                                            0 &&
                                            dayAvailability.length ===
                                                0 && (
                                                <p className="pt-5 text-center text-xs text-[var(--muted)]">
                                                    No schedule
                                                </p>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ========================= */}
            {/* MONTH VIEW */}
            {/* ========================= */}

            {view === "month" && (
                <section className="mt-5 overflow-hidden rounded-xl border border-[var(--line)] bg-white">

                    <div className="grid grid-cols-7 border-b border-[var(--line)]">

                        {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                        ].map((day) => (
                            <div
                                key={day}
                                className="p-3 text-center text-xs font-semibold text-[var(--muted)]"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">

                        {monthDays.map(
                            (date, index) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={`empty-${index}`}
                                            className="min-h-32 border-b border-r border-[var(--line)] bg-stone-50"
                                        />
                                    );
                                }

                                const dayAppointments =
                                    getAppointmentsForDate(
                                        date,
                                    );

                                const dayAvailability =
                                    getAvailableSlotsForDate(
                                        date,
                                    );

                                return (
                                    <button
                                        key={formatDate(
                                            date,
                                        )}
                                        type="button"
                                        onClick={() => {
                                            setSelectedDate(
                                                date,
                                            );

                                            setView(
                                                "day",
                                            );
                                        }}
                                        className="min-h-32 border-b border-r border-[var(--line)] p-2 text-left hover:bg-stone-50"
                                    >
                                        <p className="text-sm font-semibold">
                                            {date.getDate()}
                                        </p>

                                        <div className="mt-2 space-y-1">

                                            {/* Appointments */}
                                            {dayAppointments
                                                .slice(
                                                    0,
                                                    2,
                                                )
                                                .map(
                                                    (
                                                        appointment,
                                                    ) => (
                                                        <div
                                                            key={
                                                                appointment.id
                                                            }
                                                            className="truncate rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
                                                        >
                                                            {
                                                                appointment.startTime
                                                            }{" "}
                                                            {
                                                                appointment.patientName
                                                            }
                                                        </div>
                                                    ),
                                                )}

                                            {/* Available slots */}
                                            {dayAvailability
                                                .slice(
                                                    0,
                                                    2,
                                                )
                                                .map(
                                                    (
                                                        slot,
                                                    ) => (
                                                        <div
                                                            key={
                                                                slot.id
                                                            }
                                                            className="truncate rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                                                        >
                                                            {
                                                                slot.startTime
                                                            }{" "}
                                                            Available
                                                        </div>
                                                    ),
                                                )}

                                            {dayAppointments.length +
                                                dayAvailability.length >
                                                2 && (
                                                <p className="text-xs text-[var(--muted)]">
                                                    +
                                                    {dayAppointments.length +
                                                        dayAvailability.length -
                                                        2}{" "}
                                                    more
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </section>
            )}
        </div>
    </main>
);


}
