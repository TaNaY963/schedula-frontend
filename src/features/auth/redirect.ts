import type { UserRole } from "@/context/AuthContext";

export const AUTH_REDIRECT_PARAM = "redirect";

type BookingPathParams = {
  doctorId?: string;
  type?: string;
  reason?: string;
  rebook?: string;
};

type AuthHrefOptions = {
  role?: UserRole;
  redirect?: string | null;
};

export function getSafeRedirectPath(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}

export function buildBookingPath(params: BookingPathParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.doctorId) {
    searchParams.set("doctorId", params.doctorId);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.reason) {
    searchParams.set("reason", params.reason);
  }

  if (params.rebook) {
    searchParams.set("rebook", params.rebook);
  }

  const query = searchParams.toString();

  return query ? `/booking?${query}` : "/booking";
}

export function buildAuthHref(
  path: "/login" | "/register",
  options: AuthHrefOptions = {},
): string {
  const params = new URLSearchParams();
  const role = options.role ?? "user";

  params.set("role", role);

  const safeRedirect = getSafeRedirectPath(options.redirect ?? null);

  if (safeRedirect) {
    params.set(AUTH_REDIRECT_PARAM, safeRedirect);
  }

  return `${path}?${params.toString()}`;
}

export function getPatientLoginHref(redirectPath?: string | null): string {
  return buildAuthHref("/login", {
    role: "user",
    redirect: redirectPath ?? null,
  });
}

export function getPostLoginPath(redirectPath: string | null): string {
  return getSafeRedirectPath(redirectPath) ?? "/user/dashboard";
}

type RouterLike = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

export function navigateToBooking(
  router: RouterLike,
  isAuthenticated: boolean,
  bookingPath: string,
): void {
  if (isAuthenticated) {
    router.push(bookingPath);
    return;
  }

  router.push(getPatientLoginHref(bookingPath));
}
