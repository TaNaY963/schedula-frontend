import PatientPortalLayout from "@/components/portal/PatientPortalLayout";

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientPortalLayout>{children}</PatientPortalLayout>;
}
