"use client";
import { getAvailability } from "@/features/booking/api/availability";
import {
  getBookableDates,
  getBookableStartTimes,
  getPatientDoctorVisitHistory,
} from "@/features/booking/api/bookable-slots";
import AvailabilityDatePicker from "@/features/booking/components/AvailabilityDatePicker";
import { parseAppointmentType } from "@/features/booking/rebook";
import { useAuth } from "@/context/AuthContext";
import { getPatientLoginHref } from "@/features/auth/redirect";
import PortalMain from "@/components/portal/PortalMain";
import {
  addMinutesToTime,
  getCheckupDurationMinutes,
  getCheckupTypeLabel,
} from "@/lib/availability/bookable-slots";
import { formatTimeLabel } from "@/lib/time-slot-options";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BookingStatus } from "@/features/booking/types";
import { getDoctors } from "@/features/doctors/api/doctors";
import type { AppointmentType, CheckupType } from "@/types/appointment";
import type { Doctor } from "@/types/doctor";

type Status = "loading" | "ready" | "error";

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
  const { user, isReady: authReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [bookableStartTimes, setBookableStartTimes] = useState<string[]>([]);
  const [hasVisitedDoctor, setHasVisitedDoctor] = useState<boolean | null>(
    null,
  );
  const [checkupType, setCheckupType] = useState<CheckupType>("normal");
  const [status, setStatus] = useState<Status>("loading");
  const [scheduleStatus, setScheduleStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatus>("idle");
  const isRebook = searchParams.get("rebook") === "1";
  const preselectedDoctorId = searchParams.get("doctorId") ?? "";
  const appointmentType: AppointmentType = parseAppointmentType(
    searchParams.get("type"),
  );
  const appointmentReason =
    searchParams.get("reason")?.trim() || "General consultation";

  const durationMinutes = useMemo(
    () => getCheckupDurationMinutes(checkupType),
    [checkupType],
  );

  const selectedEndTime = selectedStartTime
    ? addMinutesToTime(selectedStartTime, durationMinutes)
    : "";

  const bookingPath = useMemo(
    () =>
      `/booking${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`,
    [searchParams],
  );

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!user) {
      router.replace(getPatientLoginHref(bookingPath));
    }
  }, [authReady, user, router, bookingPath]);

  useEffect(() => {
    if (!authReady || !user) {
      return;
    }

    Promise.all([getDoctors(), getAvailability()])
      .then(([doctorData]) => {
        setDoctors(doctorData);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [authReady, user]);

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

  useEffect(() => {
    if (!selectedDoctor || !user) {
      setHasVisitedDoctor(null);
      return;
    }

    let cancelled = false;

    getPatientDoctorVisitHistory(user.id, selectedDoctor)
      .then((visited) => {
        if (!cancelled) {
          setHasVisitedDoctor(visited);
          setCheckupType(visited ? "regular" : "normal");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasVisitedDoctor(false);
          setCheckupType("normal");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDoctor, user]);

  useEffect(() => {
    if (!selectedDoctor || hasVisitedDoctor === null) {
      setAvailableDates([]);
      return;
    }

    let cancelled = false;
    setScheduleStatus("loading");

    getBookableDates(selectedDoctor, durationMinutes)
      .then((dates) => {
        if (!cancelled) {
          setAvailableDates(dates);
          setScheduleStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableDates([]);
          setScheduleStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDoctor, durationMinutes, hasVisitedDoctor]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setBookableStartTimes([]);
      return;
    }

    let cancelled = false;
    setScheduleStatus("loading");

    getBookableStartTimes(selectedDoctor, selectedDate, durationMinutes)
      .then((startTimes) => {
        if (!cancelled) {
          setBookableStartTimes(startTimes);
          setScheduleStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBookableStartTimes([]);
          setScheduleStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDoctor, selectedDate, durationMinutes]);

  const isDoctorLocked = Boolean(preselectedDoctorId) || isRebook;

  const selectedDoctorData = doctors.find(
    (doctor) => doctor.id === selectedDoctor,
  );

  const canConfirm =
    selectedDoctor &&
    selectedDate &&
    selectedStartTime &&
    hasVisitedDoctor !== null;

  async function handleConfirm() {
    if (!canConfirm || !user || !selectedDoctorData || !selectedEndTime) {
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
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          type: appointmentType,
          reason: appointmentReason,
          checkupType,
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
    setSelectedStartTime("");
    setHasVisitedDoctor(null);
    setCheckupType("normal");
    setBookingStatus("idle");
  }

  if (!authReady || !user) {
    return (
      <PortalMain maxWidth="3xl">
        <div
          className="animate-pulse"
          aria-busy="true"
          aria-label="Checking authentication"
        >
          <div className="h-8 w-48 rounded bg-stone-200" />
          <div className="mt-6 h-96 rounded-xl bg-stone-200" />
        </div>
      </PortalMain>
    );
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
                  {formatTimeLabel(selectedStartTime)} –{" "}
                  {formatTimeLabel(selectedEndTime)}
                </span>
              </p>

              <p className="mt-4">
                <span className="text-[var(--muted)]">Checkup</span>
                <br />
                <span className="font-semibold">
                  {getCheckupTypeLabel(checkupType)}
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
              : "Select a doctor, checkup type, date, and a specific time slot."}
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
              {isDoctorLocked ? "Doctor" : "Select doctor"}
            </label>

            {isDoctorLocked && selectedDoctorData ? (
              <div className="mt-2 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-4 py-3 text-sm">
                <p className="font-semibold">{selectedDoctorData.name}</p>
                <p className="mt-1 text-[var(--muted)]">
                  {selectedDoctorData.specialty}
                </p>
              </div>
            ) : (
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(event) => {
                  setSelectedDoctor(event.target.value);
                  setSelectedDate("");
                  setSelectedStartTime("");
                  setHasVisitedDoctor(null);
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
            )}
          </div>

          {selectedDoctor && hasVisitedDoctor !== null && (
            <div className="mt-6">
              <p className="text-sm font-medium">Checkup type</p>

              {hasVisitedDoctor ? (
                <div
                  className="mt-3 grid gap-2 sm:grid-cols-2"
                  role="radiogroup"
                  aria-label="Checkup type"
                >
                  {(["regular", "normal"] as CheckupType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={checkupType === type}
                      onClick={() => {
                        setCheckupType(type);
                        setSelectedDate("");
                        setSelectedStartTime("");
                      }}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        checkupType === type
                          ? "border-[var(--brand)] bg-emerald-50 text-[var(--brand-deep)]"
                          : "border-[var(--line)] hover:border-[var(--brand)]"
                      }`}
                    >
                      <span className="block font-semibold">
                        {type === "regular"
                          ? "Regular checkup"
                          : "Normal checkup"}
                      </span>
                      <span className="mt-1 block text-[var(--muted)]">
                        {type === "regular" ? "15 minutes" : "30 minutes"}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">First visit with this doctor</p>
                  <p className="mt-1">
                    Your appointment will be a 30-minute normal checkup.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium">Select date</p>

            {!selectedDoctor || hasVisitedDoctor === null ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Choose a doctor to see available dates.
              </p>
            ) : scheduleStatus === "loading" && availableDates.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Loading available dates...
              </p>
            ) : (
              <AvailabilityDatePicker
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedStartTime("");
                }}
              />
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">
              Available time
            </p>

            {!selectedDoctor || !selectedDate ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Select a doctor and date to see available times.
              </p>
            ) : scheduleStatus === "loading" && bookableStartTimes.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Loading available times...
              </p>
            ) : bookableStartTimes.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                No available {durationMinutes}-minute slots for this date.
                {hasVisitedDoctor
                  ? " Try another checkup type or date."
                  : " Try another date."}
              </p>
            ) : (
              <div
                className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5"
                role="group"
                aria-label="Available appointment times"
              >
                {bookableStartTimes.map((startTime) => (
                  <button
                    key={startTime}
                    type="button"
                    aria-pressed={selectedStartTime === startTime}
                    aria-label={formatTimeLabel(startTime)}
                    onClick={() => setSelectedStartTime(startTime)}
                    className={`rounded-lg border px-2 py-3 text-center text-sm font-semibold transition ${
                      selectedStartTime === startTime
                        ? "border-[var(--brand)] bg-emerald-50 text-[var(--brand-deep)]"
                        : "border-[var(--line)] hover:border-[var(--brand)]"
                    }`}
                  >
                    {formatTimeLabel(startTime)}
                  </button>
                ))}
              </div>
            )}

            {selectedStartTime && selectedEndTime && (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Selected: {formatTimeLabel(selectedStartTime)} –{" "}
                {formatTimeLabel(selectedEndTime)} ({durationMinutes} min)
              </p>
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
