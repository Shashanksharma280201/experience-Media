"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "@/lib/content";
import { widthAxis } from "@/lib/type-axis";
import { useScrollEffect } from "@/hooks/useScrollProgress";
import FrameMarks from "@/components/chrome/FrameMarks";

// Pre-split so the lines can never re-wrap as the width axis animates —
// re-wrapping would be layout shift, which is the whole failure mode here.
const HEADLINE = ["We help your", "content reach", "millions."];

const META: [string, string][] = [
  ["01", "Content Engine"],
  ["02", "Brand Films"],
  ["03", "Post & VFX"],
  ["04", "Strategy"],
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  // Scroll drives Archivo's width axis and the overlay's exit.
  useScrollEffect(({ hero }) => {
    headline.current?.style.setProperty("--wdth", String(widthAxis(hero)));
    if (overlay.current) {
      overlay.current.style.opacity = String(Math.max(0, 1 - hero / 0.55));
    }
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-line span", {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.25,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.65,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} id="hero" className="relative h-[180vh]">
      <div
        ref={overlay}
        className="sticky top-0 flex h-svh flex-col justify-between px-5 pb-10 pt-28 md:px-10 md:pt-32"
      >
        <div className="hero-fade flex items-center justify-between">
          <p className="eyebrow text-paper/60">{site.tagline}</p>
          <p className="eyebrow hidden text-paper/40 md:block">[ New Delhi · IN ]</p>
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-12">
          <h1
            ref={headline}
            className="kinetic display col-span-full text-[clamp(2.6rem,9vw,8.5rem)] lg:col-span-7"
          >
            {HEADLINE.map((line, i) => (
              <span key={i} className="hero-line block overflow-hidden">
                <span className="block whitespace-nowrap">
                  {i === 2 ? (
                    <>
                      mil<span className="text-accent">lions.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-fade group relative col-span-full lg:col-span-5">
            <div className="relative overflow-hidden bg-surface">
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={site.showreelPoster}
              >
                <source src={site.showreel} type="video/mp4" />
              </video>
              <FrameMarks className="m-2" />
            </div>
            <p className="eyebrow mt-3 flex items-center justify-between text-paper/40">
              <span>Showreel</span>
              <span className="tabular-nums">16:9</span>
            </p>
          </div>
        </div>

        <div className="hero-fade grid grid-cols-2 gap-y-6 border-t border-rule pt-6 md:grid-cols-4">
          {META.map(([n, label]) => (
            <div key={n}>
              <span className="eyebrow text-accent">{n}</span>
              <p className="mt-1 text-sm text-paper/65">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
