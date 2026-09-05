"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Shell from "@/components/layout/Shell";
import { site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";

const links = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
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

  // Motion #17 — the menu's links rise out of their masks, one after another.
  // A class rather than an inline style locks scroll, so it never fights the
  // load sequence's own lock.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) return;
    root.classList.add("scroll-lock");
    const ctx = prefersReducedMotion()
      ? undefined
      : gsap.context(() => {
          gsap.from("#mobile-menu .mask-line > span", {
            yPercent: 110,
            duration: DUR.slow,
            ease: EASE.out,
            stagger: 0.06,
          });
        });
    return () => {
      root.classList.remove("scroll-lock");
      ctx?.revert();
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-base)] ${
        condensed
          ? "border-hairline bg-paper/85 backdrop-blur-md"
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
              className="link-underline small flex items-center gap-2 text-ink-dim transition-colors duration-[var(--dur-quick)] hover:text-ink"
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
            className={`h-px w-6 bg-ink transition-transform duration-[var(--dur-quick)] ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform duration-[var(--dur-quick)] ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </Shell>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-hairline bg-paper md:hidden"
      >
        <Shell className="flex flex-col gap-6 py-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display-m mask-line"
            >
              <span>{l.label}</span>
            </Link>
          ))}
        </Shell>
      </div>
    </header>
  );
}
