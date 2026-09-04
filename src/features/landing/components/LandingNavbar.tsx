"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/portal/BrandLogo";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#find-doctors", label: "Find Doctors" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? "border-[var(--line)] bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo href="#home" subtitle="Healthcare scheduling" />

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--brand-soft)]/60 hover:text-[var(--brand-deep)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login?role=user" className="schedula-btn-secondary">
            Login
          </Link>
          <Link href="/register?role=user" className="schedula-btn-primary">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div
          id="landing-mobile-menu"
          className="border-t border-[var(--line)] bg-white px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--brand-soft)]/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 grid gap-2">
            <Link
              href="/login?role=user"
              className="schedula-btn-secondary w-full"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              href="/register?role=user"
              className="schedula-btn-primary w-full"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
