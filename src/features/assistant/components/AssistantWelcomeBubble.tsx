type AssistantWelcomeBubbleProps = {
  onOpen: () => void;
  onDismiss: () => void;
};

export default function AssistantWelcomeBubble({
  onOpen,
  onDismiss,
}: AssistantWelcomeBubbleProps) {
  return (
    <div className="assistant-slide-up pointer-events-auto mb-1 max-w-[min(16rem,calc(100vw-6rem))] sm:max-w-xs">
      <div className="relative rounded-2xl border border-[var(--line)] bg-white px-4 py-3 shadow-[var(--shadow-md)]">
        <button
          type="button"
          onClick={onOpen}
          className="w-full text-left transition hover:opacity-90"
        >
          <p className="text-sm font-semibold leading-snug text-[var(--ink)]">
            👋 Need help finding a doctor?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Ask Schedula for guidance on booking and more.
          </p>
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
          className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border border-[var(--line)] bg-white text-xs text-[var(--muted)] shadow-sm hover:bg-[var(--brand-soft)] hover:text-[var(--ink)]"
          aria-label="Dismiss welcome message"
        >
          ×
        </button>

        <div
          className="absolute -bottom-2 right-6 size-3 rotate-45 border-b border-r border-[var(--line)] bg-white"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
