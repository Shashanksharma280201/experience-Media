"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Shell from "@/components/layout/Shell";
import { site } from "@/lib/content";

const links = [
  { href: "/work", label: "Work" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Talk to us" },
];

export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Motion #2 — the nav reacts to scroll rather than sitting static.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-base)] ${
        condensed
          ? "border-hairline bg-void/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <Shell className="flex items-center justify-between">
        <Link
          href="/"
          className={`font-display transition-all duration-[var(--dur-base)] ${
            condensed ? "py-4 text-[0.95rem]" : "py-6 text-[1.1rem]"
          }`}
          style={{ fontVariationSettings: '"wdth" 108, "wght" 600', letterSpacing: "-0.02em" }}
        >
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className="link-underline small flex items-center gap-2 text-bone-dim transition-colors duration-[var(--dur-quick)] hover:text-bone"
            >
              {/* Accent use #5 of 5 — current-page marker. */}
              {isCurrent(l.href) && (
                <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-signal" />
              )}
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-bone transition-transform duration-[var(--dur-quick)] ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-bone transition-transform duration-[var(--dur-quick)] ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </Shell>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-hairline bg-void md:hidden"
      >
        <Shell className="flex flex-col gap-6 py-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display-m"
            >
              {l.label}
            </Link>
          ))}
        </Shell>
      </div>
    </header>
  );
}
