"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type UserRole = "user" | "doctor";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type RoleSessions = {
  user: AuthUser | null;
  doctor: AuthUser | null;
};

type AuthContextType = {
  sessions: RoleSessions;
  isReady: boolean;
  login: (user: AuthUser) => void;
  logout: (role: UserRole) => void;
  updateProfile: (
    role: UserRole,
    updates: Pick<AuthUser, "name" | "email">,
  ) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PATIENT_STORAGE_KEY = "schedula_current_patient";
const DOCTOR_STORAGE_KEY = "schedula_current_doctor";
const LEGACY_STORAGE_KEY = "schedula_current_user";

function readStoredUser(key: string): AuthUser | null {
  const storedUser = localStorage.getItem(key);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function loadSessions(): RoleSessions {
  const legacyUser = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (legacyUser) {
    try {
      const parsedLegacyUser = JSON.parse(legacyUser) as AuthUser;
      const legacyKey =
        parsedLegacyUser.role === "doctor"
          ? DOCTOR_STORAGE_KEY
          : PATIENT_STORAGE_KEY;

      localStorage.setItem(legacyKey, legacyUser);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }

  return {
    user: readStoredUser(PATIENT_STORAGE_KEY),
    doctor: readStoredUser(DOCTOR_STORAGE_KEY),
  };
}

function storageKeyForRole(role: UserRole) {
  return role === "doctor" ? DOCTOR_STORAGE_KEY : PATIENT_STORAGE_KEY;
}

function sessionKeyForRole(role: UserRole): keyof RoleSessions {
  return role === "doctor" ? "doctor" : "user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<RoleSessions>({
    user: null,
    doctor: null,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setIsReady(true);
  }, []);

  function login(authUser: AuthUser) {
    const sessionKey = sessionKeyForRole(authUser.role);

    setSessions((currentSessions) => ({
      ...currentSessions,
      [sessionKey]: authUser,
    }));
    localStorage.setItem(
      storageKeyForRole(authUser.role),
      JSON.stringify(authUser),
    );
  }

  function logout(role: UserRole) {
    const sessionKey = sessionKeyForRole(role);

    setSessions((currentSessions) => ({
      ...currentSessions,
      [sessionKey]: null,
    }));
    localStorage.removeItem(storageKeyForRole(role));
  }

  function updateProfile(
    role: UserRole,
    updates: Pick<AuthUser, "name" | "email">,
  ) {
    const sessionKey = sessionKeyForRole(role);

    setSessions((currentSessions) => {
      const currentUser = currentSessions[sessionKey];

      if (!currentUser) {
        return currentSessions;
      }

      const updatedUser: AuthUser = {
        ...currentUser,
        name: updates.name.trim(),
        email: updates.email.trim().toLowerCase(),
      };

      localStorage.setItem(
        storageKeyForRole(role),
        JSON.stringify(updatedUser),
      );

      return {
        ...currentSessions,
        [sessionKey]: updatedUser,
      };
    });
  }

  return (
    <AuthContext.Provider
      value={{
        sessions,
        isReady,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function resolvePortalRole(pathname: string): UserRole {
  return pathname.startsWith("/doctor") ? "doctor" : "user";
}

export function useAuth() {
  const context = useContext(AuthContext);
  const pathname = usePathname();

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const portalRole = resolvePortalRole(pathname);
  const user =
    portalRole === "doctor"
      ? context.sessions.doctor
      : context.sessions.user;

  return {
    user,
    isAuthenticated: Boolean(user),
    isReady: context.isReady,
    login: context.login,
    logout: () => context.logout(portalRole),
    updateProfile: (updates: Pick<AuthUser, "name" | "email">) =>
      context.updateProfile(portalRole, updates),
  };
}
