"use client";

import { FormEvent, useState } from "react";

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