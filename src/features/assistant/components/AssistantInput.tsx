"use client";

import { FormEvent, useState } from "react";

type AssistantInputProps = {
  onSend: (value: string) => void;
  disabled?: boolean;
};

export default function AssistantInput({
  onSend,
  disabled = false,
}: AssistantInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = value.trim();

    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 border-t border-[var(--line)] bg-white/95 p-3.5 backdrop-blur-sm"
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type your question..."
        disabled={disabled}
        className="schedula-input min-w-0 flex-1 text-sm"
        aria-label="Type your question"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="schedula-btn-primary grid size-10 shrink-0 place-items-center rounded-xl p-0 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}
