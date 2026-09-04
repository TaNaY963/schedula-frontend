"use client";

import { useEffect, useMemo, useState } from "react";

import { getPublicDoctors } from "@/features/doctors/api/public-doctors";
import { getUniqueSpecialties } from "@/features/doctors/utils/filter-doctors";
import DoctorCTA from "@/features/landing/components/DoctorCTA";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import FinalCTA from "@/features/landing/components/FinalCTA";
import FindDoctorsSection from "@/features/landing/components/FindDoctorsSection";
import HeroSection from "@/features/landing/components/HeroSection";
import HowItWorks from "@/features/landing/components/HowItWorks";
import LandingFooter from "@/features/landing/components/LandingFooter";
import LandingNavbar from "@/features/landing/components/LandingNavbar";
import TrustSection from "@/features/landing/components/TrustSection";
import { scrollToElement } from "@/lib/scroll";
import type { PublicDoctor } from "@/types/public-doctor";

type Status = "loading" | "ready" | "error";

export default function LandingPage() {
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    getPublicDoctors()
      .then((data) => {
        setDoctors(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const specialties = useMemo(
    () => getUniqueSpecialties(doctors),
    [doctors],
  );

  function scrollToDoctors() {
    scrollToElement("find-doctors");
  }

  function scrollToSpecialtyResults(value: string) {
    scrollToElement(value ? "doctor-results" : "find-doctors");
  }

  function handleHeroSearch() {
    scrollToElement(specialty || query ? "doctor-results" : "find-doctors");
  }

  return (
    <div className="schedula-shell flex min-h-screen flex-col">
      <LandingNavbar />

      <main className="flex-1">
        <HeroSection
          query={query}
          specialty={specialty}
          specialties={specialties}
          onQueryChange={setQuery}
          onSpecialtyChange={setSpecialty}
          onSearch={handleHeroSearch}
        />

        <TrustSection />

        {status === "loading" && (
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="h-8 w-56 animate-pulse rounded bg-stone-100" />
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-72 animate-pulse rounded-xl bg-stone-100"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {status === "error" && (
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl schedula-card border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-800">
                We couldn&apos;t load doctors right now.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </section>
        )}

        {status === "ready" && (
          <FindDoctorsSection
            doctors={doctors}
            query={query}
            specialty={specialty}
            location={location}
            onQueryChange={setQuery}
            onSpecialtyChange={setSpecialty}
            onLocationChange={setLocation}
            onSpecialtySelect={scrollToSpecialtyResults}
          />
        )}

        <HowItWorks />
        <FeaturesSection />
        <DoctorCTA />
        <FinalCTA onFindDoctors={scrollToDoctors} />
      </main>

      <LandingFooter />
    </div>
  );
}
