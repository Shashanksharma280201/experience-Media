"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "@/lib/content";

const links = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/#capabilities", label: "What we do" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-rule bg-void/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10">
        <div
          className={`flex items-center transition-all duration-500 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="display text-[1.05rem] tracking-tight text-paper">
              Experience
            </span>
            <span className="display text-[1.05rem] tracking-tight text-accent">
              Media
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative eyebrow text-paper/70 transition-colors hover:text-paper"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow border border-accent px-4 py-2 text-accent transition-colors hover:bg-accent hover:text-void"
          >
            Let&apos;s talk
          </a>
        </nav>

        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-paper transition-all duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span className={`h-px w-6 bg-paper transition-all ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-paper transition-all duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full border-b border-rule bg-void px-5 py-8 text-paper md:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display text-3xl"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow mt-2 inline-block w-fit border border-accent px-5 py-3 text-accent"
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
