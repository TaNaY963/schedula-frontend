"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";
import DoctorCard from "@/features/doctors/components/DoctorCard";
import SpecialtyCard from "@/features/doctors/components/SpecialtyCard";
import { getDoctors } from "@/features/doctors/api/doctors";
import { scrollToElement } from "@/lib/scroll";
import type { Doctor } from "@/types/doctor";

type Status = "loading" | "ready" | "error";

export default function DoctorsPageContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get("specialty");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    initialSpecialty,
  );

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (status !== "ready" || !initialSpecialty) {
      return;
    }

    scrollToElement("doctor-results");
  }, [status, initialSpecialty]);

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty))].sort(),
    [doctors],
  );

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) {
      return doctors;
    }

    return doctors.filter((doctor) => doctor.specialty === selectedSpecialty);
  }, [doctors, selectedSpecialty]);

  const specialtyCounts = useMemo(() => {
    return specialties.reduce<Record<string, number>>((counts, specialty) => {
      counts[specialty] = doctors.filter(
        (doctor) => doctor.specialty === specialty,
      ).length;

      return counts;
    }, {});
  }, [doctors, specialties]);

  function handleSpecialtySelect(specialty: string) {
    setSelectedSpecialty(specialty);
    scrollToElement("doctor-results");
  }

  function handleClearSpecialty() {
    setSelectedSpecialty(null);
    scrollToElement("find-doctors");
  }

  return (
    <PortalMain maxWidth="6xl">
      <PageHeader
        eyebrow="Patient portal"
        title="Find a doctor"
        description="Browse specialists by department and book an appointment directly."
      />

      {status === "ready" && specialties.length > 0 && (
        <section
          id="find-doctors"
          className="scroll-mt-24 mt-8"
          aria-label="Filter by specialization"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Browse by specialization</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Select a department to see matching doctors.
              </p>
            </div>

            {selectedSpecialty && (
              <button
                type="button"
                onClick={handleClearSpecialty}
                className="schedula-btn-secondary w-fit"
              >
                Show all doctors
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty}
                specialty={specialty}
                doctorCount={specialtyCounts[specialty]}
                isActive={selectedSpecialty === specialty}
                onClick={() => handleSpecialtySelect(specialty)}
              />
            ))}
          </div>
        </section>
      )}

      {selectedSpecialty && status === "ready" && (
        <section id="doctor-results" className="scroll-mt-24 mt-8">
          <h2 className="text-lg font-semibold">
            {selectedSpecialty} specialists
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Click a doctor to book an appointment with them.
          </p>
        </section>
      )}

      {status === "loading" && (
        <div
          className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Loading doctors"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-xl bg-[var(--line)]"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div
          className="mt-8 schedula-card border-red-200 bg-red-50 p-6"
          role="alert"
        >
          <p className="font-medium text-red-800">
            We couldn&apos;t load the doctors.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {status === "ready" && filteredDoctors.length === 0 && (
        <div
          id="doctor-results"
          className="scroll-mt-24 mt-8 schedula-panel p-8 text-center"
        >
          <p className="font-medium">
            {selectedSpecialty
              ? `No doctors found for ${selectedSpecialty}.`
              : "No doctors are currently available."}
          </p>

          {selectedSpecialty && (
            <button
              type="button"
              onClick={handleClearSpecialty}
              className="mt-4 text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              View all doctors
            </button>
          )}
        </div>
      )}

      {status === "ready" && filteredDoctors.length > 0 && (
        <section
          id={selectedSpecialty ? undefined : "doctor-results"}
          className="scroll-mt-24 mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Available doctors"
        >
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </section>
      )}

    </PortalMain>
  );
}
