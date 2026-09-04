"use client";

import PortalNav from "@/components/portal/PortalNav";
import { userNavItems } from "@/components/portal/nav-config";
import { usePatientNotifications } from "@/features/notifications/PatientNotificationsProvider";

export default function UserNav() {
  const { unreadCount } = usePatientNotifications();

  return (
    <PortalNav
      items={userNavItems}
      notificationsHref="/user/notifications"
      profileHref="/user/profile"
      unreadCount={unreadCount}
    />
  );
}
