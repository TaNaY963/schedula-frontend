import DoctorNav from "@/app/doctor/DoctorNav";
import PortalLayout from "@/components/portal/PortalLayout";
import { DoctorNotificationsProvider } from "@/features/notifications/DoctorNotificationsProvider";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DoctorNotificationsProvider>
      <PortalLayout nav={<DoctorNav />}>{children}</PortalLayout>
    </DoctorNotificationsProvider>
  );
}
