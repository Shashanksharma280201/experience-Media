"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offers } from "@/lib/content";
import Timecode from "@/components/chrome/Timecode";
import FrameMarks from "@/components/chrome/FrameMarks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Three.js only loads if the visitor actually reaches the Post & VFX offer.
const VfxPanel = dynamic(() => import("@/components/webgl/VfxPanel"), {
  ssr: false,
});

export default function Capabilities({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".offer-row");
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

  const current = offers[active];

  return (
    <section
      id="capabilities"
      ref={root}
      className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]">What we do</h2>
        <Timecode index={index} total={total} label="Capabilities" />
      </div>

      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        {/* Sticky panel — the active offer's craft */}
        <div className="hidden md:col-span-5 md:block">
          <div className="group sticky top-[18vh] aspect-square overflow-hidden bg-surface">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full w-full flex-col justify-between p-10"
              >
                <span className="eyebrow text-accent tabular-nums">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(offers.length).padStart(2, "0")}
                </span>

                <div className="relative flex flex-1 items-center justify-center gap-6">
                  {current.id === "post-vfx" ? (
                    // The one offer the site can prove rather than assert.
                    <VfxPanel />
                  ) : (
                    current.services.slice(0, 3).map((s) => (
                      <Image
                        key={s.title}
                        src={s.img}
                        alt=""
                        width={140}
                        height={140}
                        className="max-h-[110px] w-auto object-contain opacity-90"
                      />
                    ))
                  )}
                </div>

                <div>
                  <p className="display text-2xl">{current.title}</p>
                  <p className="mt-3 text-sm text-paper/60">{current.summary}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <FrameMarks className="m-3" />
          </div>
        </div>

        {/* Offer list */}
        <ol className="md:col-span-7">
          {offers.map((o, i) => (
            <li
              key={o.id}
              className={`offer-row border-b border-rule py-8 transition-opacity duration-300 ${
                active === i ? "md:opacity-100" : "md:opacity-40"
              } md:hover:opacity-100`}
              onMouseEnter={() => setActive(i)}
            >
              <div className="flex items-start gap-5">
                <span className="eyebrow mt-2 shrink-0 text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="display text-[clamp(1.7rem,4vw,2.8rem)]">{o.title}</h3>
                  <p className="mt-3 max-w-lg text-sm text-paper/60 md:text-base">
                    {o.summary}
                  </p>

                  {/* Deliverable tracks — the services this offer absorbs */}
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {o.services.map((s, si) => (
                      <li
                        key={s.title}
                        className="eyebrow flex items-center gap-2 text-paper/45"
                      >
                        <span className="text-accent/70 tabular-nums">
                          V{si + 1}
                        </span>
                        {s.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
