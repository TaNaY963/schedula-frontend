"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AvailabilitySlot } from "@/features/doctor-portal/availability/types";

type Profile = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  qualification: string;
  experienceYears: string;
  registrationNumber: string;
  address: string;
};

const initialProfile: Profile = {
  name: "Dr. Anika Rao",
  email: "anika.rao@example.com",
  phone: "9876543210",
  specialty: "General Medicine",
  qualification: "MBBS, MD",
  experienceYears: "10",
  registrationNumber: "MED12345",
  address: "Bangalore",
};

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<"daily" | "weekly">("weekly");
  const [slotError, setSlotError] = useState("");

  function handleAddSlot(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSlotError("");

  if (!slotDate || !startTime || !endTime) {
    setSlotError("Please select a date, start time, and end time.");
    return;
  }

  if (startTime >= endTime) {
    setSlotError("End time must be later than start time.");
    return;
  }

  const newSlot: AvailabilitySlot = {
    id: `slot-${Date.now()}`,
    doctorId: "doc-001",
    date: slotDate,
    startTime,
    endTime,
    available: true,
    recurring,
    ...(recurring ? { recurrence } : {}),
  };

  setSlots((current) => [...current, newSlot]);

  setSlotDate("");
  setStartTime("");
  setEndTime("");
  setRecurring(false);
  setRecurrence("weekly");
}

  useEffect(() => {
  fetch("/api/availability")
    .then((response) => response.json())
    .then(({ data }) => setSlots(data))
    .catch(() => setSlots([]));
}, []);

  function updateField(field: keyof Profile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function handleRemoveSlot(id: string) {
  setSlots((current) => current.filter((slot) => slot.id !== id));
}

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-[var(--line)] pb-6">
          <p className="text-sm font-medium text-[var(--brand)]">
            Doctor portal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            View and update your professional and contact details.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-[var(--line)] bg-white p-5 sm:p-8"
        >
          <section aria-labelledby="personal-details">
            <h2 id="personal-details" className="text-lg font-semibold">
              Personal & contact details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                value={profile.name}
                onChange={(value) => updateField("name", value)}
              />

              <Field
                id="email"
                label="Email"
                type="email"
                value={profile.email}
                onChange={(value) => updateField("email", value)}
              />

              <Field
                id="phone"
                label="Phone"
                type="tel"
                value={profile.phone}
                onChange={(value) => updateField("phone", value)}
              />

              <Field
                id="address"
                label="Address"
                value={profile.address}
                onChange={(value) => updateField("address", value)}
              />
            </div>
          </section>

          <section
            className="mt-8 border-t border-[var(--line)] pt-8"
            aria-labelledby="professional-details"
          >
            <h2 id="professional-details" className="text-lg font-semibold">
              Professional details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="specialty"
                label="Specialization"
                value={profile.specialty}
                onChange={(value) => updateField("specialty", value)}
              />

              <Field
                id="qualification"
                label="Qualification"
                value={profile.qualification}
                onChange={(value) => updateField("qualification", value)}
              />

              <Field
                id="experienceYears"
                label="Experience (years)"
                type="number"
                value={profile.experienceYears}
                onChange={(value) =>
                  updateField("experienceYears", value)
                }
              />

              <Field
                id="registrationNumber"
                label="Medical registration number"
                value={profile.registrationNumber}
                onChange={(value) =>
                  updateField("registrationNumber", value)
                }
              />
            </div>
          </section>

          {saved && (
            <p
              role="status"
              className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[var(--brand-deep)]"
            >
              Profile updated successfully.
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Save changes
          </button>
        </form>


        <section
  className="mt-8 rounded-xl border border-[var(--line)] bg-white p-5 sm:p-8"
  aria-labelledby="availability-title"
>
  <h2 id="availability-title" className="text-lg font-semibold">
    Appointment availability
  </h2>

  <p className="mt-1 text-sm text-[var(--muted)]">
    Create and manage the times when patients can book appointments.
  </p>

  <form onSubmit={handleAddSlot} className="mt-5 space-y-4">
    <div>
      <label
        htmlFor="slot-date"
        className="mb-2 block text-sm font-medium"
      >
        Date
      </label>

      <input
        id="slot-date"
        type="date"
        value={slotDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(event) => setSlotDate(event.target.value)}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
      />
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="start-time"
          className="mb-2 block text-sm font-medium"
        >
          Start time
        </label>

        <input
          id="start-time"
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
        />
      </div>

      <div>
        <label
          htmlFor="end-time"
          className="mb-2 block text-sm font-medium"
        >
          End time
        </label>

        <input
          id="end-time"
          type="time"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
        />
      </div>
    </div>

    <label className="flex items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={recurring}
        onChange={(event) => setRecurring(event.target.checked)}
        className="size-4 rounded border-[var(--line)]"
      />
      Make this a recurring slot
    </label>

    {recurring && (
      <div>
        <label
          htmlFor="recurrence"
          className="mb-2 block text-sm font-medium"
        >
          Repeat
        </label>

        <select
          id="recurrence"
          value={recurrence}
          onChange={(event) =>
            setRecurrence(event.target.value as "daily" | "weekly")
          }
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
        >
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
    )}

    {slotError && (
      <p role="alert" className="text-sm text-red-600">
        {slotError}
      </p>
    )}

    <button
      type="submit"
      className="w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
    >
      Add availability
    </button>
  </form>
</section>
    <section
  className="mt-8 rounded-xl border border-[var(--line)] bg-white p-5 sm:p-8"
  aria-labelledby="existing-slots-title"
>
  <h2 id="existing-slots-title" className="text-lg font-semibold">
    Existing availability
  </h2>

  <p className="mt-1 text-sm text-[var(--muted)]">
    View and manage your current appointment slots.
  </p>

  {slots.length === 0 ? (
    <p className="mt-5 text-sm text-[var(--muted)]">
      No availability slots have been created yet.
    </p>
  ) : (
    <ul className="mt-5 divide-y divide-[var(--line)]">
      {slots.map((slot) => (
        <li
          key={slot.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">
              {slot.date}
            </p>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {slot.startTime} - {slot.endTime}
            </p>

            {slot.recurring && (
              <p className="mt-1 text-xs font-medium text-[var(--brand)]">
                Recurs {slot.recurrence}
              </p>
            )}
          </div>

          <span
            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              slot.available
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : "bg-stone-100 text-stone-600 ring-stone-200"
            }`}
          >
            {slot.available ? "Available" : "Booked"}

            <button
                type="button"
                onClick={() => handleRemoveSlot(slot.id)}
                className="w-fit rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium hover:border-red-300 hover:text-red-600"
                >
                Remove
            </button>
          </span>
        </li>
      ))}
    </ul>
  )}
</section>
      </div>
    </main>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
      />
    </div>
  );
}