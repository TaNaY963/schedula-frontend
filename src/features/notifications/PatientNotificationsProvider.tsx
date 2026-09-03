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
import { buildPatientNotifications } from "@/features/notifications/buildPatientNotifications";
import {
  getReadNotificationIds,
  saveReadNotificationIds,
} from "@/features/notifications/readStorage";
import type { PatientNotification } from "@/features/notifications/types";
import type { Appointment } from "@/types/appointment";
import type { Prescription } from "@/types/prescription";

type PatientNotificationsContextValue = {
  notifications: PatientNotification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  isRead: (id: string) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const PatientNotificationsContext =
  createContext<PatientNotificationsContextValue | undefined>(undefined);

export function PatientNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      setAppointments([]);
      setPrescriptions([]);
      setReadIds([]);
      setError("");
      setLoading(false);
      return;
    }

    const patientId = user.id;
    let cancelled = false;

    async function loadNotifications(showLoading: boolean) {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError("");

        const [appointmentsResponse, prescriptionsResponse] =
          await Promise.all([
            fetch("/api/appointments"),
            fetch(
              `/api/prescriptions?patientId=${encodeURIComponent(patientId)}`,
            ),
          ]);

        if (!appointmentsResponse.ok) {
          throw new Error("Unable to load notifications.");
        }

        const appointmentsResult = (await appointmentsResponse.json()) as {
          data: Appointment[];
        };

        const prescriptionsResult = prescriptionsResponse.ok
          ? ((await prescriptionsResponse.json()) as { data: Prescription[] })
          : { data: [] };

        if (!cancelled) {
          setAppointments(
            appointmentsResult.data.filter(
              (appointment) => appointment.patientId === patientId,
            ),
          );
          setPrescriptions(
            (prescriptionsResult.data ?? []).filter(
              (prescription) => prescription.patientId === patientId,
            ),
          );
          setReadIds(getReadNotificationIds(patientId));
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
    () => buildPatientNotifications(appointments, prescriptions),
    [appointments, prescriptions],
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
      if (!user) {
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
    <PatientNotificationsContext.Provider value={value}>
      {children}
    </PatientNotificationsContext.Provider>
  );
}

export function usePatientNotifications() {
  const context = useContext(PatientNotificationsContext);

  if (!context) {
    throw new Error(
      "usePatientNotifications must be used inside PatientNotificationsProvider",
    );
  }

  return context;
}
