"use client";

import {
  buildTimeSlotOptions,
  type TimeSlotInterval,
} from "@/lib/time-slot-options";

type TimeSlotSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  intervalMinutes?: TimeSlotInterval;
  required?: boolean;
};

export default function TimeSlotSelect({
  id,
  label,
  value,
  onChange,
  intervalMinutes = 15,
  required = false,
}: TimeSlotSelectProps) {
  const options = buildTimeSlotOptions(intervalMinutes);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <select
        id={id}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
      >
        <option value="">Select time</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
