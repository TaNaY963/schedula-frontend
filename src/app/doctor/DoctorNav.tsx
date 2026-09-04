"use client";

import PortalNav from "@/components/portal/PortalNav";
import { doctorNavItems } from "@/components/portal/nav-config";

export default function DoctorNav() {
  return (
    <PortalNav
      items={doctorNavItems}
      notificationsHref="/doctor/notifications"
      profileHref="/doctor/profile"
    />
  );
}
