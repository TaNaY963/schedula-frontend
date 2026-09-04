"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { buildDoctorNotifications } from "@/features/notifications/buildDoctorNotifications";
import {
  getReadNotificationIds,
  saveReadNotificationIds,
} from "@/features/notifications/readStorage";
import type { DoctorNotification } from "@/features/notifications/buildDoctorNotifications";
import type { Appointment } from "@/types/appointment";

type DoctorNotificationsContextValue = {
  notifications: DoctorNotification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  isRead: (id: string) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const DoctorNotificationsContext =
  createContext<DoctorNotificationsContextValue | undefined>(undefined);

export function DoctorNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user || user.role !== "doctor") {
      setAppointments([]);
      setReadIds([]);
      setError("");
      setLoading(false);
      return;
    }

    const doctorId = user.id;
    let cancelled = false;

    async function loadNotifications(showLoading: boolean) {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError("");

        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Unable to load notifications.");
        }

        const result = (await response.json()) as { data: Appointment[] };

        if (!cancelled) {
          setAppointments(
            result.data.filter(
              (appointment) => appointment.doctorId === doctorId,
            ),
          );
          setReadIds(getReadNotificationIds(doctorId));
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load notifications.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNotifications(loading);

    return () => {
      cancelled = true;
    };
  }, [isReady, user, pathname]);

  const notifications = useMemo(
    () =>
      user?.role === "doctor"
        ? buildDoctorNotifications(appointments, user.id)
        : [],
    [appointments, user],
  );

  const readIdSet = useMemo(() => new Set(readIds), [readIds]);

  const unreadCount = useMemo(
    () =>
      notifications.filter((notification) => !readIdSet.has(notification.id))
        .length,
    [notifications, readIdSet],
  );

  const persistReadIds = useCallback(
    (ids: string[]) => {
      if (!user || user.role !== "doctor") {
        return;
      }

      setReadIds(ids);
      saveReadNotificationIds(user.id, ids);
    },
    [user],
  );

  const isRead = useCallback(
    (id: string) => readIdSet.has(id),
    [readIdSet],
  );

  const markAsRead = useCallback(
    (id: string) => {
      if (readIdSet.has(id)) {
        return;
      }

      persistReadIds([...readIds, id]);
    },
    [persistReadIds, readIdSet, readIds],
  );

  const markAllAsRead = useCallback(() => {
    persistReadIds(notifications.map((notification) => notification.id));
  }, [notifications, persistReadIds]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading: !isReady || loading,
      error,
      isRead,
      markAsRead,
      markAllAsRead,
    }),
    [
      error,
      isRead,
      isReady,
      loading,
      markAllAsRead,
      markAsRead,
      notifications,
      unreadCount,
    ],
  );

  return (
    <DoctorNotificationsContext.Provider value={value}>
      {children}
    </DoctorNotificationsContext.Provider>
  );
}

export function useDoctorNotifications() {
  const context = useContext(DoctorNotificationsContext);

  if (!context) {
    throw new Error(
      "useDoctorNotifications must be used inside DoctorNotificationsProvider",
    );
  }

  return context;
}
