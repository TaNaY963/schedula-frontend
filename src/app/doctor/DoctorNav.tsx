"use client";

import PortalNav from "@/components/portal/PortalNav";
import { doctorNavItems } from "@/components/portal/nav-config";
import { useDoctorNotifications } from "@/features/notifications/DoctorNotificationsProvider";

export default function DoctorNav() {
  const { unreadCount } = useDoctorNotifications();

  return (
    <PortalNav
      items={doctorNavItems}
      notificationsHref="/doctor/notifications"
      profileHref="/doctor/profile"
      unreadCount={unreadCount}
    />
  );
}
