"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import type { AssistantMode } from "../types";

function isDoctorPortal(pathname: string): boolean {
  return pathname === "/doctor" || pathname.startsWith("/doctor/");
}

export function useAssistantMode(): AssistantMode {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return "public";
  }

  return isDoctorPortal(pathname) ? "doctor" : "patient";
}
