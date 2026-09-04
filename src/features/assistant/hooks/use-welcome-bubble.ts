"use client";

import { useCallback, useEffect, useState } from "react";

const WELCOME_STORAGE_KEY = "schedula_assistant_welcome_seen";

export function useWelcomeBubble(enabled: boolean) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const dismissed = sessionStorage.getItem(WELCOME_STORAGE_KEY) === "1";
    setIsVisible(!dismissed);
  }, [enabled]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(WELCOME_STORAGE_KEY, "1");
    setIsVisible(false);
  }, []);

  return { isVisible, dismiss };
}
