import Link from "next/link";

type FinalCTAProps = {
  onFindDoctors: () => void;
};

export default function FinalCTA({ onFindDoctors }: FinalCTAProps) {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="schedula-panel px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Ready to take control of your healthcare journey?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">
            Explore doctors on Schedula, then sign in when you are ready to book
            and manage your appointments.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onFindDoctors}
              className="schedula-btn-primary"
            >
              Find a Doctor
            </button>
            <Link href="/register?role=user" className="schedula-btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
