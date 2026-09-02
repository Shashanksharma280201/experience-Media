"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/layout/Section";
import { offers } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

export default function Services() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    // Dimming is opt-in from the DOM, not React state: without JS, or under
    // reduced motion, nothing ever marks a row active, so nothing may dim.
    el.classList.add("svc-dim");

    const ctx = gsap.context(() => {
      // Motion #9 — the hairline draws left to right as each row enters.
      gsap.from(".svc-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: DUR.base,
        ease: EASE.out,
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".svc-row").forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section label="what we do">
      <div ref={root}>
        {offers.map((o, i) => (
          <div
            key={o.id}
            className="svc-row"
            onMouseEnter={() => setActive(i)}
          >
            <div className="svc-rule h-px w-full bg-hairline" />
            <div className="grid gap-4 py-8 md:grid-cols-12 md:py-12">
              {/* Only the large title dims. Body copy stays at full contrast —
                  compounding opacity onto --bone-dim would drop it below AA. */}
              <h3 className="svc-title heading md:col-span-5" data-active={active === i}>
                {o.title}
              </h3>
              <div className="md:col-span-6 md:col-start-7">
                <p className="lede max-w-[46ch] text-bone-dim">{o.summary}</p>
                <p className="small mt-4 text-bone-faint">
                  {o.services.map((s) => s.title).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="svc-rule h-px w-full bg-hairline" />
      </div>
    </Section>
  );
}
