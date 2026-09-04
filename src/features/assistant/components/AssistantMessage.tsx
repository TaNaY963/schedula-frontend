import type { ChatMessage } from "../types";

type AssistantMessageProps = {
  message: ChatMessage;
};

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] px-4 py-3 text-[0.9375rem] leading-relaxed ${
          isAssistant
            ? "rounded-2xl rounded-bl-md border border-[var(--line)] bg-white text-[var(--ink)] shadow-[var(--shadow-sm)]"
            : "rounded-2xl rounded-br-md bg-gradient-to-br from-[var(--brand)] to-[var(--brand-deep)] text-white shadow-[var(--shadow-brand)]"
        }`}
      >
        {message.content.split("\n").map((line, index) => (
          <p
            key={index}
            className={
              index > 0 ? "mt-2.5" : isAssistant ? "font-medium" : undefined
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
