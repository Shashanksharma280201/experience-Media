"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortfolioCategory } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioGrid({
  category,
  index,
}: {
  category: PortfolioCategory;
  index: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".pf-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const isShort = category.layout === "short";

  return (
    <section ref={root} className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
      <div className="flex items-baseline justify-between border-b border-line pb-6">
        <h2 className="display text-[clamp(1.8rem,5vw,3.5rem)]">{category.title}</h2>
        <span className="eyebrow text-ink-faint">
          {String(index + 1).padStart(2, "0")} · {category.items.length} pieces
        </span>
      </div>

      <div
        className={`mt-10 grid gap-4 ${
          isShort
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {category.items.map((item, i) => (
          <a
            key={`${item.href}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`pf-card group relative block overflow-hidden rounded-sm border border-line bg-night ${
              isShort ? "aspect-[9/16]" : "aspect-video"
            }`}
          >
            <Image
              src={item.thumb}
              alt={`${category.title} — ${item.platform}`}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="eyebrow text-paper">Watch on {item.platform}</span>
              <span className="text-paper">↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
