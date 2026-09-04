import Link from "next/link";

import SpecialtyIcon from "@/features/doctors/components/SpecialtyIcon";
import {
  buildSpecialtyHref,
  getSpecialtyMeta,
} from "@/features/doctors/specialties";

type SpecialtyCardProps = {
  specialty: string;
  doctorCount?: number;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function SpecialtyCard({
  specialty,
  doctorCount,
  href,
  isActive = false,
  onClick,
}: SpecialtyCardProps) {
  const meta = getSpecialtyMeta(specialty);
  const destination = href ?? buildSpecialtyHref(specialty);

  const className = `group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] ${
    isActive
      ? "border-[var(--brand)] bg-emerald-50 shadow-[var(--shadow-sm)]"
      : `${meta.accentClass} hover:border-[var(--brand)]`
  }`;

  const content = (
    <>
      <div
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${meta.iconBgClass} ${meta.iconColorClass}`}
      >
        <SpecialtyIcon specialty={specialty} className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--ink)]">
          {meta.label}
        </p>

        {typeof doctorCount === "number" && (
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {doctorCount} doctor{doctorCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <span
        className="shrink-0 text-sm text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
        aria-hidden="true"
      >
        →
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={destination} className={className}>
      {content}
    </Link>
  );
}
