const INTENT_ICONS: Record<string, string> = {
  "find-doctor": "🔎",
  "book-appointment": "📅",
  "login-signup": "🔐",
  "how-it-works": "✨",
  "are-you-doctor": "🩺",
  "what-can-i-do": "💡",
  "my-appointments": "📋",
  "my-prescriptions": "💊",
  "my-profile": "👤",
  help: "❓",
  "todays-appointments": "📆",
  "add-availability": "➕",
  "remove-slot": "➖",
  "open-calendar": "🗓️",
  "manage-appointments": "📋",
  "manage-prescriptions": "💊",
};

export function getMenuIcon(intentId?: string): string {
  if (!intentId) {
    return "💬";
  }

  return INTENT_ICONS[intentId] ?? "💬";
}

export const PUBLIC_LANDING_MENU_IDS = [
  "find-doctor",
  "book-appointment",
  "login-signup",
  "how-it-works",
] as const;
