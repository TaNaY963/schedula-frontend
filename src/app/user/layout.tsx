import UserNav from "@/app/user/UserNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
          <div className="flex min-h-16 items-center justify-between gap-6">
            <div className="shrink-0">
              <span className="text-xl font-bold tracking-tight text-[var(--brand)]">
                Schedula
              </span>
            </div>

            <UserNav />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}