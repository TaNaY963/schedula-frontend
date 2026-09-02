import type { UserRole } from "@/context/AuthContext";

export function parseAuthRole(value: string | null): UserRole {
  return value === "doctor" ? "doctor" : "user";
}

export function roleQuery(role: UserRole) {
  return role === "doctor" ? "?role=doctor" : "?role=user";
}
