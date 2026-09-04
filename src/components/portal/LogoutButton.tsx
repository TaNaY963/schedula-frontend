"use client";

import { usePathname, useRouter } from "next/navigation";

import { LogoutIcon } from "@/components/portal/icons";
import { useAuth } from "@/context/AuthContext";

type LogoutButtonProps = {
  variant?: "nav" | "profile";
};

export default function LogoutButton({ variant = "nav" }: LogoutButtonProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    const role =
      user?.role ?? (pathname.startsWith("/doctor") ? "doctor" : "user");

    logout();
    router.push(role === "doctor" ? "/login?role=doctor" : "/login");
  }

  if (variant === "profile") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Log out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out"
      title="Log out"
      className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-red-50 hover:text-[var(--danger)]"
    >
      <LogoutIcon />
    </button>
  );
}
