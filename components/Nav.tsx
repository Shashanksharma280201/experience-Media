"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "@/lib/content";

const links = [
  { href: "/", label: "Index" },
  { href: "/portfolio", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [heroDark, setHeroDark] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect the dark WebGL hero (set on <html> by Hero) so the nav can go light.
  useEffect(() => {
    const check = () => setHeroDark(document.documentElement.classList.contains("hero-dark"));
    check();
    const id = window.setTimeout(check, 60); // allow Hero effect to run
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.clearTimeout(id);
      obs.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Light treatment while sitting over the dark hero and not yet scrolled.
  const light = heroDark && !scrolled && !open;
  const ink = light ? "text-paper" : "text-ink";
  const bar = light ? "bg-paper" : "bg-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/80 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10">
        <div className={`flex items-center transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
          <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className={`display text-[1.05rem] tracking-tight transition-colors ${ink}`}>
              Experience
            </span>
            <span className="display text-[1.05rem] tracking-tight text-accent">Media</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative eyebrow transition-colors ${
                light ? "text-paper/80 hover:text-paper" : "text-ink/80 hover:text-ink"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`eyebrow rounded-full border px-4 py-2 transition-colors ${
              light
                ? "border-paper text-paper hover:bg-paper hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-paper"
            }`}
          >
            Let&apos;s talk
          </a>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className={`h-px w-6 transition-all duration-300 ${bar} ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`h-px w-6 transition-all ${bar} ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 transition-all duration-300 ${bar} ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 py-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="display text-3xl">
                  {l.label}
                </Link>
              ))}
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow mt-2 inline-block w-fit rounded-full border border-ink px-5 py-3"
              >
                Let&apos;s talk on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
