import { getMenuIcon } from "../utils/menu-icons";

import type { AssistantAction } from "../types";

type AssistantQuickActionsProps = {
  actions: AssistantAction[];
  onAction: (action: AssistantAction) => void;
  variant?: "menu" | "inline";
};

export default function AssistantQuickActions({
  actions,
  onAction,
  variant = "inline",
}: AssistantQuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  if (variant === "menu") {
    return (
      <div className="flex flex-col gap-2 px-1">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action)}
            className="group flex w-full items-center gap-3 rounded-xl border border-[var(--line)] bg-white px-3.5 py-3 text-left shadow-[var(--shadow-sm)] transition hover:-translate-y-px hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/40 hover:shadow-[var(--shadow-md)]"
          >
            <span
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--brand-soft)] text-base transition group-hover:bg-white"
              aria-hidden="true"
            >
              {getMenuIcon(action.intentId)}
            </span>
            <span className="text-sm font-medium leading-snug text-[var(--ink)]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-1">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onAction(action)}
          className="schedula-btn-secondary px-3.5 py-2 text-xs font-medium transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
