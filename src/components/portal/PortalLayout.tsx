"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import BrandLogo from "@/components/portal/BrandLogo";

const AUTH_ROUTES = ["/doctor/login", "/doctor/register"];

type PortalLayoutProps = {
  children: ReactNode;
  nav: ReactNode;
};

export default function PortalLayout({ children, nav }: PortalLayoutProps) {
  const pathname = usePathname();
  const hideChrome = AUTH_ROUTES.includes(pathname);
  const isDoctorPortal = pathname.startsWith("/doctor");
  const dashboardHref = isDoctorPortal ? "/doctor/dashboard" : "/user/dashboard";

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="schedula-shell">
      <header className="schedula-header">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
          <div className="flex min-h-[4.25rem] items-center justify-between gap-6">
            <BrandLogo
              href={dashboardHref}
              subtitle={
                isDoctorPortal ? "Doctor scheduling portal" : "Patient portal"
              }
            />

            {nav}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
