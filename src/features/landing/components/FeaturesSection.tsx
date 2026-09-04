const features = [
  {
    title: "Doctor discovery",
    description:
      "Browse doctors by specialty with profiles that highlight qualifications and experience.",
  },
  {
    title: "Appointment scheduling",
    description:
      "Patients can book visits through a guided booking flow after signing in.",
  },
  {
    title: "Appointment management",
    description:
      "View upcoming and past appointments, reschedule when needed, and stay informed.",
  },
  {
    title: "Calendar-based scheduling",
    description:
      "Doctors can manage availability and appointments from an organized calendar workspace.",
  },
  {
    title: "Prescription management",
    description:
      "Doctors can issue prescriptions and patients can access them from their portal.",
  },
  {
    title: "Patient appointment tracking",
    description:
      "Patients receive notifications and can follow their care journey in one place.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="schedula-eyebrow">Features</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Everything you need for healthcare scheduling
          </h2>
          <p className="mt-3 text-base text-[var(--muted)]">
            Schedula supports patients and doctors with tools for discovery,
            booking, and ongoing care coordination.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="schedula-card p-5">
              <h3 className="text-base font-semibold text-[var(--ink)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
