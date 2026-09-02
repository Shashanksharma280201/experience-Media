"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/layout/Section";
import { testimonials, type Testimonial } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

function Quote({ t }: { t: Testimonial }) {
  return (
    <figure className="border-t border-hairline py-8 md:py-10">
      <blockquote className="text-[1.0625rem] leading-relaxed text-bone-dim md:text-[1.15rem]">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6">
        <span className="block font-display text-bone [font-variation-settings:'wdth'_104,'wght'_600]">
          {t.author}
        </span>
        {t.role && <span className="small mt-1 block text-bone-faint">{t.role}</span>}
      </figcaption>
    </figure>
  );
}

/** Motion #11 — two columns travelling at different speeds. */
export default function Testimonials() {
  const root = useRef<HTMLDivElement>(null);

  // Balance by quote length rather than by index: alternating leaves one column
  // hundreds of pixels short, since these quotes vary a lot in length.
  const left: Testimonial[] = [];
  const right: Testimonial[] = [];
  let lLen = 0;
  let rLen = 0;
  for (const t of testimonials) {
    if (lLen <= rLen) {
      left.push(t);
      lLen += t.quote.length;
    } else {
      right.push(t);
      rLen += t.quote.length;
    }
  }

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    // Only worth doing where the columns actually sit side by side.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(".col-slow", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(".col-fast", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section label="what people say">
      <div ref={root} className="grid gap-x-12 md:grid-cols-2">
        <div className="col-slow">
          {left.map((t) => (
            <Quote key={t.author} t={t} />
          ))}
        </div>
        <div className="col-fast">
          {right.map((t) => (
            <Quote key={t.author} t={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}
