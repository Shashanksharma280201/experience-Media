"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/lib/content";
import { detectTier } from "@/lib/webgl-capability";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const headline = ["We help your", "content reach", "millions."];

function Headline({ light }: { light: boolean }) {
  return (
    <h1
      className={`display text-[clamp(3rem,13vw,12rem)] ${
        light ? "drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      {headline.map((line, i) => (
        <span key={i} className="hero-line block overflow-hidden">
          <span className="block">
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
  );
}

const META: [string, string][] = [
  ["01", "Motion & VFX"],
  ["02", "YouTube Management"],
  ["03", "Social Content"],
  ["04", "Production"],
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  // null = undetermined (SSR-safe); render the static hero until known.
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    setWebgl(detectTier() !== "off");
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !webgl) return;

    // Flag the dark hero so the Nav can switch to light text over it.
    document.documentElement.classList.add("hero-dark");

    const ctx = gsap.context(() => {
      gsap.from(".hero-line span", {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.3,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 18,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.7,
      });
    }, el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      if (overlay.current) {
        overlay.current.style.opacity = String(Math.max(0, 1 - p / 0.45));
        overlay.current.style.transform = `translateY(${-p * 40}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("hero-dark");
      ctx.revert();
    };
  }, [webgl]);

  // --- Static hero (reduced-motion / no-WebGL / low-end): v1 look ---
  if (!webgl) {
    return (
      <section className="relative flex min-h-svh flex-col justify-between px-5 pb-10 pt-32 md:px-10 md:pt-40">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-ink-soft">{site.tagline}</p>
          <p className="eyebrow hidden text-ink-faint md:block">[ New Delhi · IN ]</p>
        </div>
        <div className="mt-auto">
          <Headline light={false} />
          <div className="mt-8 overflow-hidden rounded-sm bg-night">
            <video
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/webgl/hero-poster.jpg"
            >
              <source src="/assets/webgl/hero-loop.mp4" type="video/mp4" />
              <source src={site.showreel} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    );
  }

  // --- WebGL hero: tall transparent region over the multiverse canvas ---
  return (
    <div ref={root} id="hero-scroll" className="relative h-[200vh]">
      <div
        ref={overlay}
        className="sticky top-0 flex h-svh flex-col justify-between px-5 pb-10 pt-32 text-paper md:px-10 md:pt-40"
      >
        <div className="hero-fade flex items-center justify-between">
          <p className="eyebrow text-paper/70">{site.tagline}</p>
          <p className="eyebrow hidden text-paper/45 md:block">[ New Delhi · IN ]</p>
        </div>

        <div className="mt-auto">
          <Headline light />
          <div className="hero-fade mt-10 grid grid-cols-2 gap-y-6 border-t border-paper/20 pt-6 md:grid-cols-4">
            {META.map(([n, label]) => (
              <div key={n}>
                <span className="eyebrow text-accent">{n}</span>
                <p className="mt-1 text-sm text-paper/70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-fade mt-10 flex items-center gap-3 text-paper/50">
          <span className="eyebrow">Scroll to explore</span>
          <span className="h-px w-12 bg-paper/40" />
        </div>
      </div>
    </div>
  );
}
