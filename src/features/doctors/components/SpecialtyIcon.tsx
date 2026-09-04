import type { ReactNode } from "react";

type SpecialtyIconProps = {
  specialty: string;
  className?: string;
};

function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.75 4.5v3a3 3 0 0 0 6 0v-3" />
      <path d="M9.75 7.5V12a5.25 5.25 0 0 0 10.5 0V7.5" />
      <circle cx="18.75" cy="17.25" r="2.25" />
      <path d="M18.75 15v-1.5a2.25 2.25 0 0 0-2.25-2.25h-.75" />
    </svg>
  );
}

function DermatologyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c-2.5 2.2-4 4.6-4 7.2 0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.6-1.5-5-4-7.2Z" />
      <path d="M8.5 17.5c.8 1.6 2.1 2.5 3.5 2.5s2.7-.9 3.5-2.5" />
      <path d="M6 20.5h12" />
    </svg>
  );
}

function CardiologyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.25s-6.75-4.2-6.75-9.45C5.25 7.2 7.65 5.25 10.2 5.25c1.5 0 2.55.75 3.3 1.8.75-1.05 1.8-1.8 3.3-1.8 2.55 0 4.95 1.95 4.95 5.55C18.75 16.05 12 20.25 12 20.25Z" />
      <path d="M8.25 12h2.25l1.5-2.25L13.5 13.5h2.25" />
    </svg>
  );
}

function PediatricsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="2.5" />
      <path d="M8.5 20.5v-2a3.5 3.5 0 0 1 7 0v2" />
      <path d="M6 11.5c.8-1.5 2.4-2.5 4.2-2.5" />
      <path d="M18 11.5c-.8-1.5-2.4-2.5-4.2-2.5" />
    </svg>
  );
}

function OrthopedicsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 4.5v6.5l-3 3" />
      <path d="M16 4.5v6.5l3 3" />
      <path d="M8 11h8" />
      <path d="M12 11v7.5" />
      <circle cx="12" cy="20.5" r="1.5" />
    </svg>
  );
}

function NeurologyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 4.5c-2 2-3 4.2-3 6.5a3 3 0 0 0 6 0c0-2.3-1-4.5-3-6.5Z" />
      <path d="M9 14.5c-.5 1.2-.5 2.5 0 3.8.8 1.8 2.2 2.7 3 2.7s2.2-.9 3-2.7c.5-1.3.5-2.6 0-3.8" />
      <path d="M8.5 20.5h7" />
    </svg>
  );
}

function OphthalmologyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M12 9.25v-1.5M12 16.25v-1.5" />
    </svg>
  );
}

function DefaultMedicalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 6v12" />
      <path d="M6 12h12" />
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
    </svg>
  );
}

const specialtyIconMap: Record<string, (props: { className?: string }) => ReactNode> = {
  "General Medicine": StethoscopeIcon,
  Dermatology: DermatologyIcon,
  Cardiology: CardiologyIcon,
  Pediatrics: PediatricsIcon,
  Orthopedics: OrthopedicsIcon,
  Neurology: NeurologyIcon,
  Ophthalmology: OphthalmologyIcon,
};

export default function SpecialtyIcon({
  specialty,
  className = "h-6 w-6",
}: SpecialtyIconProps) {
  const Icon = specialtyIconMap[specialty] ?? DefaultMedicalIcon;

  return <Icon className={className} />;
}
