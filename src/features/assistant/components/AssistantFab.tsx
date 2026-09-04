type AssistantFabProps = {
  isOpen: boolean;
  showPulse: boolean;
  onClick: () => void;
};

export default function AssistantFab({
  isOpen,
  showPulse,
  onClick,
}: AssistantFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`assistant-fab group relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] text-white shadow-[var(--shadow-brand)] transition hover:scale-[1.03] hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc] ${
        isOpen ? "size-14" : "h-14 min-w-14 gap-0 pr-1.5 sm:gap-2 sm:pr-2 sm:pl-4"
      }`}
      aria-label={isOpen ? "Minimize assistant" : "Open Schedula Assistant"}
      aria-expanded={isOpen}
    >
      {showPulse && !isOpen && (
        <span
          className="assistant-pulse-ring absolute inset-0 rounded-full"
          aria-hidden="true"
        />
      )}

      {!isOpen && (
        <span className="hidden whitespace-nowrap text-sm font-semibold tracking-tight sm:inline">
          Ask Schedula
        </span>
      )}

      <span
        className={`relative z-10 grid shrink-0 place-items-center rounded-full bg-white/15 ${
          isOpen ? "size-14" : "size-11"
        }`}
      >
        {isOpen ? (
          <CloseIcon className="size-5" />
        ) : (
          <SchedulaMark className="text-sm font-bold" />
        )}
      </span>
    </button>
  );
}

function SchedulaMark({ className }: { className?: string }) {
  return <span className={className} aria-hidden="true">S</span>;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
