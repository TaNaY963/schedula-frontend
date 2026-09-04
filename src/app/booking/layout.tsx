import PatientPortalLayout from "@/components/portal/PatientPortalLayout";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientPortalLayout>{children}</PatientPortalLayout>;
}
