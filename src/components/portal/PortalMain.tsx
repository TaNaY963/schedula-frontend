import type { ReactNode } from "react";

const maxWidthClasses = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

type PortalMainProps = {
  children: ReactNode;
  maxWidth?: keyof typeof maxWidthClasses;
  className?: string;
};

export default function PortalMain({
  children,
  maxWidth = "6xl",
  className = "",
}: PortalMainProps) {
  return (
    <main className={`px-4 py-8 sm:px-8 lg:px-12 ${className}`}>
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>{children}</div>
    </main>
  );
}
