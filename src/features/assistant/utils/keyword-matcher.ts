import type { AssistantIntent } from "../types";

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchIntent(
  input: string,
  intents: AssistantIntent[],
): AssistantIntent | null {
  const normalized = normalizeText(input);

  if (!normalized) {
    return null;
  }

  for (const intent of intents) {
    for (const keyword of intent.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (
        normalized === normalizedKeyword ||
        normalized.includes(normalizedKeyword)
      ) {
        return intent;
      }
    }
  }

  return null;
}

export function getVisibleMenuOptions(intents: AssistantIntent[]): AssistantIntent[] {
  return intents.filter((intent) => intent.label.length > 0);
}
