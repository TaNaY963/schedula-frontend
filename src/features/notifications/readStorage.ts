const STORAGE_PREFIX = "schedula_read_notifications_";

export function getReadNotificationIds(userId: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveReadNotificationIds(userId: string, ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    `${STORAGE_PREFIX}${userId}`,
    JSON.stringify(ids),
  );
}
