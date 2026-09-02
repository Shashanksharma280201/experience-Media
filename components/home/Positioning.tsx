"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/layout/Section";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// DRAFT COPY — flagged for review.
const PARAGRAPHS = [
  "We started as creators, which means we build for the algorithm and the audience at the same time. Most studios pick one.",
  "Everything is made in-house — strategy through final grade — so nothing is lost in a handoff, and nothing waits on someone else's calendar.",
];

/** Splits into words while keeping the sentence readable to assistive tech. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="pw inline-block">
          {w}
          {" "}
        </span>
      ))}
    </>
  );
}

export default function Positioning() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Motion #7 — word-by-word opacity wipe. No translation.
      gsap.fromTo(
        ".pw",
        { opacity: 0.2 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.024,
          duration: 0.5,
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 62%",
            scrub: 0.4,
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Section id="studio" label="what we believe">
      <div ref={root} className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3">
          {PARAGRAPHS.map((p, i) => (
            <p key={i} className={`display-m ${i > 0 ? "mt-10 md:mt-14" : ""}`}>
              <Words text={p} />
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
