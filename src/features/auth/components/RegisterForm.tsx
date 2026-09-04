"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FlashBanner from "@/components/portal/FlashBanner";
import { saveUser } from "@/lib/storage/users";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      saveUser({
        id: `user-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting you to login...",
      );

      window.setTimeout(() => {
        router.push("/login?role=user");
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

      <div>
        <label
          htmlFor="register-name"
          className="mb-2 block text-sm font-medium"
        >
          Full name
        </label>

        <input
          id="register-name"
          type="text"
          value={form.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
          placeholder="Tanay Pant"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
          placeholder="you@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-2 block text-sm font-medium"
        >
          Password
        </label>

        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) =>
            updateField("password", event.target.value)
          }
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
          placeholder="At least 8 characters"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-confirm-password"
          className="mb-2 block text-sm font-medium"
        >
          Confirm password
        </label>

        <input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
          placeholder="Re-enter your password"
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}