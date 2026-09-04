"use client";

import { useEffect } from "react";

type FlashBannerProps = {
  message: string;
  variant: "success" | "error";
  onDismiss: () => void;
  autoHideMs?: number;
};

export default function FlashBanner({
  message,
  variant,
  onDismiss,
  autoHideMs = 5000,
}: FlashBannerProps) {
  useEffect(() => {
    if (!message || autoHideMs <= 0) {
      return;
    }

    const timeout = window.setTimeout(onDismiss, autoHideMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message, autoHideMs, onDismiss]);

  if (!message) {
    return null;
  }

  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      role={variant === "success" ? "status" : "alert"}
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      <p className="flex-1">{message}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="shrink-0 rounded-md px-2 py-0.5 text-base leading-none opacity-70 transition hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
