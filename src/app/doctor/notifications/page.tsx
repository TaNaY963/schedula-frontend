import PageHeader from "@/components/portal/PageHeader";
import PortalMain from "@/components/portal/PortalMain";

export default function DoctorNotificationsPage() {
  return (
    <PortalMain maxWidth="3xl">
      <PageHeader
        eyebrow="Doctor portal"
        title="Notifications"
        description="Stay updated on appointment requests and patient activity."
      />

      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="p-8 text-center text-[var(--muted)]">
          <p className="font-medium text-[var(--ink)]">No notifications yet</p>
          <p className="mt-2 text-sm">
            You&apos;ll see appointment updates and patient messages here.
          </p>
        </div>
      </section>
    </PortalMain>
  );
}
