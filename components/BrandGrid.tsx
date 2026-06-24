"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandGrid() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".brand-cell", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "expo.out",
        stagger: { each: 0.05, grid: "auto", from: "start" },
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-night text-paper">
      <div ref={root} className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex items-baseline justify-between border-b border-paper/15 pb-6">
          <h2 className="display text-[clamp(1.8rem,4vw,3rem)]">Trusted by brands</h2>
          <span className="eyebrow text-paper/50">[ {brands.length} partners ]</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <div
              key={b.name}
              className="brand-cell group relative flex aspect-[3/2] items-center justify-center border-b border-r border-paper/10 p-8"
              title={b.name}
            >
              <Image
                src={b.img}
                alt={b.name}
                width={180}
                height={90}
                className="max-h-[52px] w-auto object-contain opacity-55 brightness-0 invert transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
              />
              <span className="eyebrow pointer-events-none absolute bottom-3 left-3 text-[0.6rem] text-paper/0 transition-colors duration-300 group-hover:text-accent">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
