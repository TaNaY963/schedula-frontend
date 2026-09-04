import PublicDoctorCard from "@/features/landing/components/PublicDoctorCard";
import SpecialtyCard from "@/features/doctors/components/SpecialtyCard";
import {
  filterPublicDoctors,
  getUniqueLocations,
  getUniqueSpecialties,
} from "@/features/doctors/utils/filter-doctors";
import type { PublicDoctor } from "@/types/public-doctor";

type FindDoctorsSectionProps = {
  doctors: PublicDoctor[];
  query: string;
  specialty: string;
  location: string;
  onQueryChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSpecialtySelect: (value: string) => void;
};

export default function FindDoctorsSection({
  doctors,
  query,
  specialty,
  location,
  onQueryChange,
  onSpecialtyChange,
  onLocationChange,
  onSpecialtySelect,
}: FindDoctorsSectionProps) {
  const specialties = getUniqueSpecialties(doctors);
  const locations = getUniqueLocations(doctors);
  const filteredDoctors = filterPublicDoctors(doctors, {
    query,
    specialty,
    location,
  });

  const specialtyCounts = specialties.reduce<Record<string, number>>(
    (counts, item) => {
      counts[item] = doctors.filter((doctor) => doctor.specialty === item).length;
      return counts;
    },
    {},
  );

  function handleSpecialtyFilterChange(value: string) {
    onSpecialtyChange(value);
    onSpecialtySelect(value);
  }

  return (
    <section
      id="find-doctors"
      className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="schedula-eyebrow">Find a doctor</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Browse specialists on Schedula
          </h2>
          <p className="mt-3 text-base text-[var(--muted)]">
            Search and filter doctors from our directory. View a profile to learn
            more before signing in to book.
          </p>
        </div>

        {specialties.length > 0 && (
          <div className="mt-8" aria-label="Browse by specialty">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  Browse by specialty
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Select a department to jump to matching doctors.
                </p>
              </div>

              {specialty && (
                <button
                  type="button"
                  onClick={() => handleSpecialtyFilterChange("")}
                  className="schedula-btn-secondary w-fit"
                >
                  Show all doctors
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {specialties.map((item) => (
                <SpecialtyCard
                  key={item}
                  specialty={item}
                  doctorCount={specialtyCounts[item]}
                  isActive={specialty === item}
                  onClick={() => handleSpecialtyFilterChange(item)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)] lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <label className="sr-only" htmlFor="directory-search">
            Search doctors
          </label>
          <input
            id="directory-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, specialty, qualification, or location"
            className="schedula-input"
          />

          <label className="sr-only" htmlFor="directory-specialty">
            Filter by specialty
          </label>
          <select
            id="directory-specialty"
            value={specialty}
            onChange={(event) =>
              handleSpecialtyFilterChange(event.target.value)
            }
            className="schedula-input"
          >
            <option value="">All specialties</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="directory-location">
            Filter by location
          </label>
          <select
            id="directory-location"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className="schedula-input"
          >
            <option value="">All locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div id="doctor-results" className="scroll-mt-24">
          <p className="mt-4 text-sm text-[var(--muted)]">
            Showing {filteredDoctors.length} of {doctors.length} doctors
            {specialty ? ` in ${specialty}` : ""}
          </p>

          {filteredDoctors.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <PublicDoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="mt-6 schedula-panel p-10 text-center">
              <p className="font-medium text-[var(--ink)]">
                No doctors match your search.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
