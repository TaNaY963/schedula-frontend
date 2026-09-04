"use client";

import { useMemo, useState } from "react";

type AvailabilityDatePickerProps = {
  availableDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function formatDayLabel(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AvailabilityDatePicker({
  availableDates,
  selectedDate,
  onSelectDate,
}: AvailabilityDatePickerProps) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const initialMonth = useMemo(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    if (availableDates[0]) {
      const [year, month] = availableDates[0].split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [availableDates, selectedDate, today]);

  const [visibleMonth, setVisibleMonth] = useState(initialMonth);

  const availableDateSet = useMemo(
    () => new Set(availableDates),
    [availableDates],
  );

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ dateKey: string; day: number } | null> = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      cells.push({
        dateKey: toDateKey(date),
        day,
      });
    }

    return cells;
  }, [visibleMonth]);

  function goToPreviousMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  }

  if (availableDates.length === 0) {
    return (
      <p className="mt-2 text-sm text-[var(--muted)]">
        No available dates for this doctor right now.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          aria-label="Previous month"
        >
          ←
        </button>

        <p className="text-sm font-semibold">{formatMonthLabel(visibleMonth)}</p>

        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--muted)]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarDays.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isAvailable = availableDateSet.has(cell.dateKey);
          const isPast = new Date(`${cell.dateKey}T00:00:00`) < today;
          const isSelected = selectedDate === cell.dateKey;
          const isDisabled = !isAvailable || isPast;

          return (
            <button
              key={cell.dateKey}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(cell.dateKey)}
              aria-label={`${formatDayLabel(cell.dateKey)}${isAvailable ? " available" : ""}`}
              aria-pressed={isSelected}
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                isSelected
                  ? "bg-[var(--brand)] text-white"
                  : isAvailable && !isPast
                    ? "bg-white text-[var(--brand-deep)] ring-1 ring-emerald-200 hover:ring-[var(--brand)]"
                    : "cursor-not-allowed text-stone-300"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        Highlighted dates have open appointment slots.
      </p>
    </div>
  );
}
