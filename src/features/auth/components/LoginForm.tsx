"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import { getDoctors } from "@/lib/storage/doctors";
import { getUsers } from "@/lib/storage/users";

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginForm({ role }: { role: UserRole }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
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

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (role === "doctor") {
        const doctor = getDoctors().find(
          (item) =>
            item.email.toLowerCase() === normalizedEmail &&
            item.password === password,
        );

        if (!doctor) {
          setErrors({
            form: "Invalid doctor email or password.",
          });
          return;
        }

        login({
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          role: "doctor",
        });

        router.push("/doctor/dashboard");
        return;
      }

      const user = getUsers().find(
        (item) =>
          item.email.toLowerCase() === normalizedEmail &&
          item.password === password,
      );

      if (!user) {
        setErrors({
          form: "Invalid email or password.",
        });
        return;
      }

      login({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      });

      router.push("/user/dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`schedula-input ${
            errors.email ? "border-red-400" : ""
          }`}
          placeholder={
            role === "doctor" ? "doctor@example.com" : "you@example.com"
          }
        />

        {errors.email && (
          <p id="email-error" className="mt-1.5 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>

          <button
            type="button"
            className="text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-deep)]"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`schedula-input ${
            errors.password ? "border-red-400" : ""
          }`}
          placeholder="Enter your password"
        />

        {errors.password && (
          <p id="password-error" className="mt-1.5 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="schedula-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Signing in..."
          : role === "doctor"
            ? "Sign in as doctor"
            : "Sign in as patient"}
      </button>
    </form>
  );
}
