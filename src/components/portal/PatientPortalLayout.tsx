import UserNav from "@/app/user/UserNav";
import PortalLayout from "@/components/portal/PortalLayout";
import { PatientNotificationsProvider } from "@/features/notifications/PatientNotificationsProvider";

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatientNotificationsProvider>
      <PortalLayout nav={<UserNav />}>{children}</PortalLayout>
    </PatientNotificationsProvider>
  );
}
