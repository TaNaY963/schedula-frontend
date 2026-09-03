"use client";

import type { UserRole } from "@/context/AuthContext";

const roles: { id: UserRole; label: string; description: string }[] = [
  {
    id: "user",
    label: "Patient",
    description: "Book visits and view prescriptions",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Manage appointments and availability",
  },
];

export default function RoleToggle({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1"
      role="radiogroup"
      aria-label="Account type"
    >
      {roles.map((role) => {
        const selected = value === role.id;

        return (
          <button
            key={role.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(role.id)}
            className={`rounded-lg px-3 py-2.5 text-left transition ${
              selected
                ? "bg-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <span className="block text-sm font-semibold">{role.label}</span>
            <span className="mt-0.5 block text-xs text-[var(--muted)]">
              {role.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
