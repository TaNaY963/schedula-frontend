"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FlashBanner from "@/components/portal/FlashBanner";
import { saveDoctor } from "@/lib/storage/doctors";

type FormData = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  qualification: string;
  experienceYears: string;
  registrationNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>> & {
  form?: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  specialty: "",
  qualification: "",
  experienceYears: "",
  registrationNumber: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export default function DoctorRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  }

  function validateForm(): FormErrors {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Full name is required.";

    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone)) {
      next.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.specialty.trim()) next.specialty = "Specialization is required.";
    if (!form.qualification.trim()) {
      next.qualification = "Qualification is required.";
    }

    if (!form.experienceYears.trim()) {
      next.experienceYears = "Experience is required.";
    } else if (!/^\d+$/.test(form.experienceYears)) {
      next.experienceYears = "Enter a valid number of years.";
    }

    if (!form.registrationNumber.trim()) {
      next.registrationNumber = "Medical registration number is required.";
    }

    if (!form.address.trim()) next.address = "Address is required.";

    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      saveDoctor({
        id: `doc-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialty: form.specialty.trim(),
        qualification: form.qualification.trim(),
        experienceYears: Number(form.experienceYears),
        registrationNumber: form.registrationNumber.trim(),
        address: form.address.trim(),
        password: form.password,
      });

      setSuccessMessage(
        "Doctor account created successfully. Redirecting you to login...",
      );

      window.setTimeout(() => {
        router.push("/login?role=doctor");
      }, 2000);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {successMessage && (
        <FlashBanner
          message={successMessage}
          variant="success"
          onDismiss={() => setSuccessMessage("")}
          autoHideMs={0}
        />
      )}

      {errors.form && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </p>
      )}

      <section>
        <h2 className="text-lg font-semibold">Personal details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id="name"
            label="Full name"
            value={form.name}
            error={errors.name}
            placeholder="Dr. Anika Rao"
            onChange={(value) => updateField("name", value)}
          />

          <Field
            id="email"
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            placeholder="doctor@example.com"
            onChange={(value) => updateField("email", value)}
          />

          <Field
            id="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            error={errors.phone}
            placeholder="9876543210"
            onChange={(value) => updateField("phone", value)}
          />

          <Field
            id="address"
            label="Address"
            value={form.address}
            error={errors.address}
            placeholder="Clinic or practice address"
            className="sm:col-span-2"
            onChange={(value) => updateField("address", value)}
          />
        </div>
      </section>

      <section className="border-t border-[var(--line)] pt-6">
        <h2 className="text-lg font-semibold">Professional details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id="specialty"
            label="Specialization"
            value={form.specialty}
            error={errors.specialty}
            placeholder="General Medicine"
            onChange={(value) => updateField("specialty", value)}
          />

          <Field
            id="qualification"
            label="Qualification"
            value={form.qualification}
            error={errors.qualification}
            placeholder="MBBS, MD"
            onChange={(value) => updateField("qualification", value)}
          />

          <Field
            id="experienceYears"
            label="Experience (years)"
            type="number"
            value={form.experienceYears}
            error={errors.experienceYears}
            placeholder="10"
            onChange={(value) => updateField("experienceYears", value)}
          />

          <Field
            id="registrationNumber"
            label="Medical registration number"
            value={form.registrationNumber}
            error={errors.registrationNumber}
            placeholder="MED12345"
            onChange={(value) =>
              updateField("registrationNumber", value)
            }
          />
        </div>
      </section>

      <section className="border-t border-[var(--line)] pt-6">
        <h2 className="text-lg font-semibold">Account details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id="password"
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            placeholder="At least 8 characters"
            onChange={(value) => updateField("password", value)}
          />

          <Field
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            onChange={(value) =>
              updateField("confirmPassword", value)
            }
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Registering..." : "Create doctor account"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  error,
  placeholder,
  type = "text",
  className = "",
  onChange,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none ${
          error
            ? "border-red-400"
            : "border-[var(--line)] focus:border-[var(--brand)]"
        }`}
        placeholder={placeholder}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

