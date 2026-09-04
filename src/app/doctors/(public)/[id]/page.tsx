"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/portal/BrandLogo";
import DoctorAvatar from "@/features/doctors/components/DoctorAvatar";
import SpecialtyIcon from "@/features/doctors/components/SpecialtyIcon";
import { getPublicDoctor } from "@/features/doctors/api/public-doctors";
import {
  buildAuthHref,
  buildBookingPath,
  navigateToBooking,
} from "@/features/auth/redirect";
import { getSpecialtyMeta } from "@/features/doctors/specialties";
import type { PublicDoctor } from "@/types/public-doctor";
import type { Doctor } from "@/types/doctor";

type Status = "loading" | "ready" | "error";

function toAvatarDoctor(doctor: PublicDoctor): Doctor {
  return {
    id: doctor.id,
    name: doctor.name,
    imageUrl: doctor.imageUrl,
    email: "",
    phone: "",
    specialty: doctor.specialty,
    qualification: doctor.qualification,
    experienceYears: doctor.experienceYears,
    registrationNumber: "",
    address: doctor.location,
    consultationFee: doctor.consultationFee,
    available: doctor.acceptingAppointments,
  };
}

function formatConsultationTypes(types: PublicDoctor["consultationTypes"]) {
  return types
    .map((type) => (type === "in-person" ? "In-person" : "Video"))
    .join(" · ");
}

export default function PublicDoctorProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isReady: authReady } = useAuth();
  const [doctor, setDoctor] = useState<PublicDoctor | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!params.id) {
      return;
    }

    getPublicDoctor(params.id)
      .then((data) => {
        setDoctor(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [params.id]);

  function handleBookAppointment() {
    if (!doctor) {
      return;
    }

    navigateToBooking(
      router,
      isAuthenticated,
      buildBookingPath({ doctorId: doctor.id }),
    );
  }

  const registerHref = buildAuthHref("/register", {
    role: "user",
    redirect: doctor
      ? buildBookingPath({ doctorId: doctor.id })
      : null,
  });

  return (
    <div className="schedula-shell min-h-screen">
      <header className="border-b border-[var(--line)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandLogo href="/" subtitle="Healthcare scheduling" />
          <div className="flex items-center gap-2">
            <Link href="/login?role=user" className="schedula-btn-secondary">
              Login
            </Link>
            <Link href="/register?role=user" className="schedula-btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/#find-doctors"
          className="text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          ← Back to doctors
        </Link>

        {status === "loading" && (
          <div className="mt-8 animate-pulse space-y-4" aria-busy="true">
            <div className="h-64 rounded-2xl bg-stone-100" />
            <div className="h-40 rounded-2xl bg-stone-100" />
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 schedula-card border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-800">Doctor profile not found.</p>
            <Link
              href="/#find-doctors"
              className="mt-3 inline-block text-sm font-semibold text-red-700 underline"
            >
              Browse doctors
            </Link>
          </div>
        )}

        {status === "ready" && doctor && (
          <article className="mt-8 overflow-hidden schedula-panel">
            <div className="relative h-56 sm:h-72">
              <DoctorAvatar
                doctor={toAvatarDoctor(doctor)}
                size="xl"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/85">
                      {doctor.specialty}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                      {doctor.name}
                    </h1>
                  </div>
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${getSpecialtyMeta(doctor.specialty).iconBgClass} ${getSpecialtyMeta(doctor.specialty).iconColorClass}`}
                    aria-hidden="true"
                  >
                    <SpecialtyIcon
                      specialty={doctor.specialty}
                      className="h-5 w-5"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--ink)]">About</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {doctor.bio}
                </p>

                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="schedula-card p-4">
                    <dt className="text-sm text-[var(--muted)]">Qualification</dt>
                    <dd className="mt-1 font-medium">{doctor.qualification}</dd>
                  </div>
                  <div className="schedula-card p-4">
                    <dt className="text-sm text-[var(--muted)]">Experience</dt>
                    <dd className="mt-1 font-medium">
                      {doctor.experienceYears} years
                    </dd>
                  </div>
                  <div className="schedula-card p-4">
                    <dt className="text-sm text-[var(--muted)]">Location</dt>
                    <dd className="mt-1 font-medium">{doctor.location}</dd>
                  </div>
                  <div className="schedula-card p-4">
                    <dt className="text-sm text-[var(--muted)]">
                      Consultation fee
                    </dt>
                    <dd className="mt-1 font-medium">₹{doctor.consultationFee}</dd>
                  </div>
                  <div className="schedula-card p-4 sm:col-span-2">
                    <dt className="text-sm text-[var(--muted)]">
                      Consultation types
                    </dt>
                    <dd className="mt-1 font-medium">
                      {formatConsultationTypes(doctor.consultationTypes)}
                    </dd>
                  </div>
                </dl>
              </div>

              <aside className="schedula-card h-fit p-5">
                <p className="text-sm font-medium text-[var(--muted)]">
                  Ready to book?
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    doctor.acceptingAppointments
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {doctor.acceptingAppointments
                    ? "Accepting new appointments"
                    : "Currently unavailable for booking"}
                </p>

                <button
                  type="button"
                  disabled={!doctor.acceptingAppointments || !authReady}
                  onClick={handleBookAppointment}
                  className="schedula-btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {user ? "Book Appointment" : "Sign in to Book"}
                </button>

                {!user && (
                  <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                    Sign in to choose a time and confirm your appointment. Slot
                    availability is shown only after authentication.
                  </p>
                )}

                {!user && (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    New to Schedula?{" "}
                    <Link
                      href={registerHref}
                      className="font-semibold text-[var(--brand)] hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                )}
              </aside>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
