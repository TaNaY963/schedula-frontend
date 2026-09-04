export type AssistantMode = "public" | "patient" | "doctor";

export type AssistantActionType = "navigate" | "scroll" | "intent";

export type AssistantAction = {
  id: string;
  label: string;
  type: AssistantActionType;
  href?: string;
  scrollTarget?: string;
  intentId?: string;
};

export type AssistantIntent = {
  id: string;
  label: string;
  keywords: string[];
  response: string;
  actions?: AssistantAction[];
};

export type AssistantConfig = {
  initialMessage: string;
  menuOptions: AssistantIntent[];
  fallbackMessage: string;
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: AssistantAction[];
};
