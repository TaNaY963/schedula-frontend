import PatientPortalLayout from "@/components/portal/PatientPortalLayout";

export default function DoctorsPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientPortalLayout>{children}</PatientPortalLayout>;
}
