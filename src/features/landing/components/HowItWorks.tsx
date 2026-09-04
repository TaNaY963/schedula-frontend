const steps = [
  {
    title: "Find a doctor",
    description:
      "Search by name, specialty, qualification, or location to discover specialists.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
  },
  {
    title: "Explore their profile",
    description:
      "Review qualifications, experience, location, and consultation details.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </svg>
    ),
  },
  {
    title: "Sign in and book",
    description:
      "Create an account or log in to choose a time and confirm your appointment.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M4.5 9.75h15M4.5 7.5A2.25 2.25 0 0 1 6.75 5.25h10.5A2.25 2.25 0 0 1 19.5 7.5v11.25A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75V7.5Z"
        />
      </svg>
    ),
  },
  {
    title: "Manage appointments",
    description:
      "Track upcoming visits, notifications, and prescriptions from your patient portal.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-[var(--line)] bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="schedula-eyebrow">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            From discovery to care, in four steps
          </h2>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="schedula-card p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-[var(--brand-soft)] text-sm font-bold text-[var(--brand-deep)]">
                  {index + 1}
                </span>
                <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
