"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/layout/Section";
import { telemetry } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";

/** Proof points as typography — no cards, no borders around figures. */
export default function Credibility() {
  const root = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Motion #8 — figures roll up out of a masked column.
      gsap.from(".fig > span", {
        yPercent: 105,
        duration: DUR.reveal,
        ease: EASE.out,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section label="the record">
      <dl
        ref={root}
        className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8"
      >
        {telemetry.map((t) => (
          <div key={t.label}>
            <dd className="fig mask-line display-m">
              <span>{t.value}</span>
            </dd>
            <dt className="small mt-3 max-w-[22ch] text-bone-dim">{t.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
