"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function DoctorLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm(): LoginErrors {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock login until a real authentication API is available.
      await new Promise((resolve) => setTimeout(resolve, 700));

      router.push("/doctor/dashboard");
    } catch {
      setErrors({
        form: "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </p>
      )}

      <div>
        <label
          htmlFor="doctor-email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="doctor-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({
              ...current,
              email: undefined,
              form: undefined,
            }));
          }}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none ${
            errors.email
              ? "border-red-400"
              : "border-[var(--line)] focus:border-[var(--brand)]"
          }`}
          placeholder="doctor@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="doctor-password"
          className="mb-2 block text-sm font-medium"
        >
          Password
        </label>

        <input
          id="doctor-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((current) => ({
              ...current,
              password: undefined,
              form: undefined,
            }));
          }}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none ${
            errors.password
              ? "border-red-400"
              : "border-[var(--line)] focus:border-[var(--brand)]"
          }`}
          placeholder="Enter your password"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Doctor login"}
      </button>
    </form>
  );
}