"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import LogoutButton from "@/components/portal/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/lib/storage/users";

type ProfileForm = {
  name: string;
  email: string;
};

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    name: "",
    email: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfile({
      name: user.name,
      email: user.email,
    });
  }, [user]);

  function updateField(field: keyof ProfileForm, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!profile.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      updateUser(user.id, {
        name: profile.name,
        email: profile.email,
      });

      updateProfile({
        name: profile.name,
        email: profile.email,
      });

      setSaved(true);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update profile.",
      );
    }
  }

  if (!user) {
    return (
      <PortalMain maxWidth="3xl">
        <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="font-medium">Please log in to view your profile.</p>

          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Go to Login
          </Link>
        </div>
      </PortalMain>
    );
  }

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PortalMain maxWidth="3xl">
      <PageHeader
        eyebrow="Patient portal"
        title="My Profile"
        description="View and update your account information."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white"
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-xl font-semibold text-[var(--brand)]">
              {initials}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Patient</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="schedula-input"
                required
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="schedula-input"
                required
              />
            </div>

            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">Account type</p>
              <p className="mt-1 font-medium">Patient</p>
            </div>

            <div className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--muted)]">User ID</p>
              <p className="mt-1 font-medium break-all">{user.id}</p>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-6 text-sm text-red-600">
              {error}
            </p>
          )}

          {saved && (
            <p
              role="status"
              className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[var(--brand-deep)]"
            >
              Profile updated successfully.
            </p>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-end">
            <LogoutButton variant="profile" />

            <button
              type="submit"
              className="schedula-btn-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </PortalMain>
  );
}
