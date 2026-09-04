"use client";
import { getAvailability } from "@/features/booking/api/availability";
import { parseAppointmentType } from "@/features/booking/rebook";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";
import { useAuth } from "@/context/AuthContext";
import PortalMain from "@/components/portal/PortalMain";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TimeSlot, BookingStatus } from "@/features/booking/types";
import { getDoctors } from "@/features/doctors/api/doctors";
import type { AppointmentType } from "@/types/appointment";
import type { Doctor } from "@/types/doctor";

type Status = "loading" | "ready" | "error";

function formatSlotTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <PortalMain maxWidth="3xl">
          <div
            className="animate-pulse"
            aria-busy="true"
            aria-label="Loading booking page"
          >
            <div className="h-8 w-48 rounded bg-stone-200" />
            <div className="mt-6 h-96 rounded-xl bg-stone-200" />
          </div>
        </PortalMain>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatus>("idle");
  const isRebook = searchParams.get("rebook") === "1";
  const preselectedDoctorId = searchParams.get("doctorId") ?? "";
  const appointmentType: AppointmentType = parseAppointmentType(
    searchParams.get("type"),
  );
  const appointmentReason =
    searchParams.get("reason")?.trim() || "General consultation";

  useEffect(() => {
    Promise.all([getDoctors(), getAvailability()])
      .then(([doctorData, availabilityData]) => {
        setDoctors(doctorData);
        setAvailability(availabilityData);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (status !== "ready" || !preselectedDoctorId) {
      return;
    }

    const doctorExists = doctors.some(
      (doctor) => doctor.id === preselectedDoctorId,
    );

    if (doctorExists) {
      setSelectedDoctor(preselectedDoctorId);
    }
  }, [status, doctors, preselectedDoctorId]);

  const selectedDoctorData = doctors.find(
    (doctor) => doctor.id === selectedDoctor,
  );
  const doctorSlots = availability.filter(
    (slot) =>
      slot.doctorId === selectedDoctor &&
      (!selectedDate || slot.date === selectedDate),
  );

  const canConfirm =
    selectedDoctor && selectedDate && selectedSlot;

  async function handleConfirm() {
    if (!canConfirm || !user || !selectedDoctorData) {
      return;
    }

    const selectedSlotData = doctorSlots.find(
      (slot) => slot.id === selectedSlot,
    );

    if (!selectedSlotData) {
      return;
    }

    setBookingStatus("confirming");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: selectedDoctorData.id,
          doctorName: selectedDoctorData.name,
          patientId: user.id,
          patientName: user.name,
          date: selectedDate,
          startTime: selectedSlotData.startTime,
          endTime: selectedSlotData.endTime,
          type: appointmentType,
          reason: appointmentReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to book appointment.",
        );
      }

      setBookingStatus("confirmed");

      setTimeout(() => {
        router.push("/user/appointments");
      }, 800);
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      setBookingStatus("idle");
      alert(
        error instanceof Error
          ? error.message
          : "Unable to book appointment.",
      );
    }
  }

  function handleReset() {
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedSlot("");
    setBookingStatus("idle");
  }

  if (status === "loading") {
    return (
      <PortalMain maxWidth="3xl">
        <div
          className="animate-pulse"
          aria-busy="true"
          aria-label="Loading booking page"
        >
          <div className="h-8 w-48 rounded bg-stone-200" />
          <div className="mt-6 h-96 rounded-xl bg-stone-200" />
        </div>
      </PortalMain>
    );
  }

  if (status === "error") {
    return (
      <PortalMain maxWidth="3xl">
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-6"
          role="alert"
        >
          <p className="font-medium text-red-800">
            We couldn&apos;t load the booking information.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </PortalMain>
    );
  }

  if (bookingStatus === "confirmed") {
    return (
      <PortalMain maxWidth="3xl">
        <div className="flex min-h-[60vh] items-center">
          <section
            className="w-full rounded-xl border border-[var(--line)] bg-white p-8 text-center"
            aria-labelledby="confirmation-title"
          >
            <div
              className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-2xl text-[var(--brand)]"
              aria-hidden="true"
            >
              ✓
            </div>

            <h1
              id="confirmation-title"
              className="mt-5 text-2xl font-semibold"
            >
              Appointment confirmed
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              {isRebook
                ? "Your follow-up appointment has been successfully booked."
                : "Your appointment has been successfully booked."}
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-lg bg-stone-50 p-4 text-left text-sm">
              <p>
                <span className="text-[var(--muted)]">Doctor</span>
                <br />
                <span className="font-semibold">
                  {selectedDoctorData?.name}
                </span>
              </p>

              <p className="mt-4">
                <span className="text-[var(--muted)]">Date</span>
                <br />
                <span className="font-semibold">{selectedDate}</span>
              </p>

              <p className="mt-4">
                <span className="text-[var(--muted)]">Time</span>
                <br />
                <span className="font-semibold">
                  {doctorSlots.find((slot) => slot.id === selectedSlot)?.startTime}
                  {" – "}
                  {doctorSlots.find((slot) => slot.id === selectedSlot)?.endTime}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Book another appointment
            </button>
          </section>
        </div>
      </PortalMain>
    );
  }

  return (
    <PortalMain maxWidth="3xl">
        <section className="py-2" aria-labelledby="booking-title">
          <p className="text-sm font-medium text-[var(--brand)]">
            Appointment
          </p>

          <h1
            id="booking-title"
            className="mt-2 text-3xl font-semibold tracking-tight"
          >
            {isRebook ? "Rebook this visit" : "Book a doctor"}
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            {isRebook
              ? "Choose a new date and time with the same doctor, consultation type, and reason."
              : "Select a doctor, date, and available time."}
          </p>
        </section>

        <section
          className="rounded-xl border border-[var(--line)] bg-white p-5 sm:p-6"
          aria-label="Appointment booking form"
        >
          {isRebook && (
            <div className="mb-6 rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-4 text-sm">
              <p>
                <span className="text-[var(--muted)]">Reason: </span>
                <span className="font-medium">{appointmentReason}</span>
              </p>
              <p className="mt-2">
                <span className="text-[var(--muted)]">Type: </span>
                <span className="font-medium">
                  {appointmentType === "video"
                    ? "Video consultation"
                    : "In-person consultation"}
                </span>
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium"
            >
              Select doctor
            </label>

            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(event) => {
                setSelectedDoctor(event.target.value);
                setSelectedSlot("");
              }}
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
            >
              <option value="">Choose a doctor</option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                  disabled={!doctor.available}
                >
                  {doctor.name} — {doctor.specialty}
                  {!doctor.available ? " (Unavailable)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium"
            >
              Select date
            </label>

            <input
              id="date"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedSlot("");
              }}
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">
              Available time
            </p>

            {!selectedDoctor || !selectedDate ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Select a doctor and date to see available times.
              </p>
            ) : doctorSlots.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                No available slots for this doctor on the selected date.
              </p>
            ) : (
              <div
                className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
                role="group"
                aria-label="Available appointment times"
              >
                {doctorSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    aria-pressed={selectedSlot === slot.id}
                    aria-label={`${formatSlotTime(slot.startTime)} to ${formatSlotTime(slot.endTime)}${slot.available ? "" : " - unavailable"}`}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`flex min-w-0 flex-col items-center justify-center rounded-lg border px-2 py-3 text-center transition ${
                      selectedSlot === slot.id
                        ? "border-[var(--brand)] bg-emerald-50 text-[var(--brand-deep)]"
                        : slot.available
                          ? "border-[var(--line)] hover:border-[var(--brand)]"
                          : "cursor-not-allowed border-[var(--line)] bg-stone-100 text-stone-400"
                    }`}
                  >
                    <span className="text-sm font-semibold leading-tight">
                      {formatSlotTime(slot.startTime)}
                    </span>
                    <span className="mt-0.5 text-xs leading-tight text-[var(--muted)]">
                      to {formatSlotTime(slot.endTime)}
                    </span>
                    {!slot.available && (
                      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide">
                        Booked
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!canConfirm || bookingStatus === "confirming"}
            onClick={handleConfirm}
            className="mt-7 w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {bookingStatus === "confirming"
              ? "Confirming..."
              : isRebook
                ? "Confirm follow-up"
                : "Confirm appointment"}
          </button>
        </section>
    </PortalMain>
  );
}