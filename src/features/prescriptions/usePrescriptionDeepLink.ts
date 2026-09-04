"use client";

import { useEffect, useRef, useState } from "react";

import type { Prescription } from "@/types/prescription";

export function getPrescriptionIdFromHash() {
  if (typeof window === "undefined") {
    return null;
  }

  const match = window.location.hash.match(/^#prescription-(.+)$/);
  return match?.[1] ?? null;
}

export function scrollToPrescriptionElement(prescriptionId: string) {
  const element = document.getElementById(`prescription-${prescriptionId}`);

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  return true;
}

type UsePrescriptionDeepLinkOptions = {
  onMatch?: (prescription: Prescription) => void;
};

export function usePrescriptionDeepLink(
  prescriptions: Prescription[],
  loading: boolean,
  options?: UsePrescriptionDeepLinkOptions,
) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const handledHashRef = useRef<string | null>(null);
  const onMatchRef = useRef(options?.onMatch);
  onMatchRef.current = options?.onMatch;

  useEffect(() => {
    if (loading) {
      return;
    }

    const prescriptionId = getPrescriptionIdFromHash();

    if (!prescriptionId) {
      handledHashRef.current = null;
      return;
    }

    const currentHash = window.location.hash;

    if (handledHashRef.current === currentHash) {
      return;
    }

    const prescription = prescriptions.find(
      (item) => item.id === prescriptionId,
    );

    if (!prescription) {
      return;
    }

    handledHashRef.current = currentHash;

    const scrollTimeout = window.setTimeout(() => {
      if (!onMatchRef.current) {
        scrollToPrescriptionElement(prescriptionId);
      }

      setHighlightedId(prescriptionId);
      onMatchRef.current?.(prescription);
    }, 100);

    const highlightTimeout = window.setTimeout(() => {
      setHighlightedId(null);
    }, 4000);

    return () => {
      window.clearTimeout(scrollTimeout);
      window.clearTimeout(highlightTimeout);
    };
  }, [loading, prescriptions]);

  return highlightedId;
}

export function prescriptionHighlightClass(isHighlighted: boolean) {
  return isHighlighted
    ? "rounded-xl ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-white"
    : "";
}
