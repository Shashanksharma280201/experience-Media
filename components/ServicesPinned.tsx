"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesPinned() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Smooth "link" reveal as we scroll out of the hero into What we do.
      gsap.from(".services-intro", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });

      const rows = gsap.utils.toArray<HTMLElement>(".service-row");
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const current = services[active];

  return (
    <section id="services" ref={root} className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
      <div className="services-intro flex items-baseline justify-between border-b border-line pb-6">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]">What we do</h2>
        <span className="eyebrow text-ink-faint">[ 01 — Services ]</span>
      </div>

      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        {/* Sticky visual panel — desktop */}
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-[18vh] aspect-square overflow-hidden rounded-sm bg-night">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full w-full flex-col items-center justify-center gap-8 p-12"
              >
                <span className="eyebrow self-start text-accent">
                  {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
                <Image
                  src={current.img}
                  alt={current.title}
                  width={220}
                  height={220}
                  className="max-h-[160px] w-auto object-contain"
                />
                <p className="display self-start text-2xl text-paper">{current.title}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* List */}
        <ol className="md:col-span-7">
          {services.map((s, i) => (
            <li
              key={s.title}
              className={`service-row group border-b border-line py-7 transition-colors duration-300 ${
                active === i ? "md:opacity-100" : "md:opacity-40"
              } md:hover:opacity-100`}
              onMouseEnter={() => setActive(i)}
            >
              <div className="flex items-start gap-5">
                <span className="eyebrow mt-2 shrink-0 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="display text-[clamp(1.6rem,4vw,2.6rem)]">{s.title}</h3>
                  <p className="mt-2 max-w-md text-sm text-ink-soft md:text-base">{s.desc}</p>
                  {/* inline icon on mobile */}
                  <div className="mt-5 flex aspect-video w-full items-center justify-center rounded-sm bg-night md:hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      width={160}
                      height={160}
                      className="max-h-[96px] w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
