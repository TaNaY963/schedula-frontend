import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="rounded-2xl border border-[var(--line)] bg-white/80 p-6 shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && <p className="schedula-eyebrow">{eyebrow}</p>}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)]">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-[var(--muted)]">{description}</p>
          )}
        </div>

        {action}
      </div>
    </header>
  );
}
