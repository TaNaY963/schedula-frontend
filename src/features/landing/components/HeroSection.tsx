import Link from "next/link";

type HeroSectionProps = {
  query: string;
  specialty: string;
  specialties: string[];
  onQueryChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onSearch: () => void;
};

export default function HeroSection({
  query,
  specialty,
  specialties,
  onQueryChange,
  onSpecialtyChange,
  onSearch,
}: HeroSectionProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -right-20 top-0 size-72 rounded-full bg-[var(--brand-soft)]/80 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-[var(--accent-soft)]/70 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="schedula-eyebrow">Healthcare made simple</p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Find the right doctor. Book with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Discover trusted doctors, explore their expertise, and manage your
            healthcare appointments with Schedula.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-md)] sm:p-5"
          >
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
              <label className="sr-only" htmlFor="hero-search">
                Search doctors
              </label>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search by name, specialty, or location"
                className="schedula-input"
              />

              <label className="sr-only" htmlFor="hero-specialty">
                Specialty
              </label>
              <select
                id="hero-specialty"
                value={specialty}
                onChange={(event) => onSpecialtyChange(event.target.value)}
                className="schedula-input"
              >
                <option value="">All specialties</option>
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button type="submit" className="schedula-btn-primary">
                Find Doctors
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSearch}
              className="schedula-btn-primary"
            >
              Find Doctors
            </button>
            <Link href="/register?role=user" className="schedula-btn-secondary">
              Get Started
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="schedula-card overflow-hidden">
            <div className="bg-gradient-to-br from-[var(--brand-soft)] to-white p-6">
              <p className="text-sm font-semibold text-[var(--brand-deep)]">
                Your healthcare journey
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  "Browse doctors by specialty",
                  "Review qualifications and experience",
                  "Sign in to book and manage visits",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[var(--ink)]"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[var(--brand)] shadow-sm">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--line)] bg-white px-6 py-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Trusted care
              </p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                Real doctors from Schedula
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
