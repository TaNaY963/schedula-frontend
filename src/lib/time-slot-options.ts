export type TimeSlotInterval = 15 | 30;

export function formatTimeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildTimeSlotOptions(intervalMinutes: TimeSlotInterval = 15) {
  const options: { value: string; label: string }[] = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += intervalMinutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    const value = `${hours}:${mins}`;

    options.push({
      value,
      label: formatTimeLabel(value),
    });
  }

  return options;
}
