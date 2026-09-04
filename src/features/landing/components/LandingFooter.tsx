import Link from "next/link";

import BrandLogo from "@/components/portal/BrandLogo";

const footerLinks = {
  product: [
    { href: "#home", label: "Home" },
    { href: "#find-doctors", label: "Find Doctors" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
  ],
  account: [
    { href: "/login?role=user", label: "Login" },
    { href: "/register?role=user", label: "Register" },
    { href: "/register?role=doctor", label: "Doctor Registration" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo subtitle="Healthcare scheduling" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              Schedula helps patients discover trusted doctors and manage
              healthcare appointments in one organized place.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--ink)]">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--ink)]">Account</h2>
            <ul className="mt-4 space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--line)] pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Schedula. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
