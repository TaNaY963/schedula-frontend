import PatientPortalLayout from "@/components/portal/PatientPortalLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientPortalLayout>{children}</PatientPortalLayout>;
}
