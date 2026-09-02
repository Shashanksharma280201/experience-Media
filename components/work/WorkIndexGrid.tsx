"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortfolioCategory } from "@/lib/content";
import FrameMarks from "@/components/chrome/FrameMarks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkIndexGrid({
  category,
  index,
}: {
  category: PortfolioCategory;
  index: number;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".work-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const isShort = category.layout === "short";

  return (
    <section ref={root} className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
        <h2 className="display text-[clamp(1.7rem,4.5vw,3.2rem)]">{category.title}</h2>
        <span className="eyebrow tabular-nums text-paper/40">
          {String(index + 1).padStart(2, "0")} · {category.items.length} pieces
        </span>
      </div>

      <div
        className={`mt-10 grid gap-5 ${
          isShort
            ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {category.items.map((item, i) => (
          <a
            key={`${item.href}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={`${item.platform} ▸ ${isShort ? "9:16" : "16:9"}`}
            className={`work-card group relative block overflow-hidden bg-surface ${
              isShort ? "aspect-[9/16]" : "aspect-video"
            }`}
          >
            <Image
              src={item.thumb}
              alt={`${category.title} — ${item.platform}`}
              fill
              sizes={isShort ? "(min-width: 768px) 20vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
              className="object-cover opacity-75 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
            />
            <FrameMarks className="m-2" size="size-3" />
            <span className="eyebrow absolute bottom-3 left-3 text-[0.6rem] text-transparent transition-colors duration-300 group-hover:text-accent">
              {item.platform} ↗
            </span>
            <span className="eyebrow absolute right-3 top-3 text-[0.58rem] tabular-nums text-paper/0 transition-colors duration-300 group-hover:text-paper/70">
              {isShort ? "9:16" : "16:9"}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
