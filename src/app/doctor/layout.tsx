import DoctorNav from "@/app/doctor/DoctorNav";
import PortalLayout from "@/components/portal/PortalLayout";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout nav={<DoctorNav />}>{children}</PortalLayout>;
}
