import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
  compact?: boolean;
};

export default function BrandLogo({
  href,
  subtitle = "Healthcare scheduling",
  compact = false,
}: BrandLogoProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] text-lg font-bold text-white shadow-[var(--shadow-brand)]">
        S
      </div>

      {!compact && (
        <div>
          <p className="text-lg font-bold tracking-tight text-[var(--ink)]">
            Schedula
          </p>
          <p className="text-xs font-medium text-[var(--muted)]">{subtitle}</p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0 transition hover:opacity-90">
        {content}
      </Link>
    );
  }

  return <div className="shrink-0">{content}</div>;
}
