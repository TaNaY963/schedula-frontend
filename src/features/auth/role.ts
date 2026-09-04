import type { UserRole } from "@/context/AuthContext";

import {
  AUTH_REDIRECT_PARAM,
  buildAuthHref,
  getPostLoginPath,
  getSafeRedirectPath,
} from "@/features/auth/redirect";

export function parseAuthRole(value: string | null): UserRole {
  return value === "doctor" ? "doctor" : "user";
}

export function roleQuery(role: UserRole, redirect?: string | null) {
  const params = new URLSearchParams();
  params.set("role", role);

  const safeRedirect = getSafeRedirectPath(redirect ?? null);

  if (safeRedirect) {
    params.set(AUTH_REDIRECT_PARAM, safeRedirect);
  }

  return `?${params.toString()}`;
}

export { AUTH_REDIRECT_PARAM, buildAuthHref, getPostLoginPath };
