"use client";

import { useEffect, useRef } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// DRAFT COPY — flagged for review.
const STATEMENT =
  "We started as creators, so we build for the algorithm and the audience at the same time. Most agencies pick one.";
const SECOND =
  "Strategy, production and distribution under one roof — so nothing is lost in a handoff, and nothing waits on someone else's calendar.";

/** Every word in its own mask, so the statement can rise word by word. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="word-mask">
            <span className="pw">{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/**
 * 03 — what we believe. The statement as a full-width poster on the sun
 * tint; its words rise out of their masks with the scroll (motion #7).
 */
export default function Positioning() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pw",
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: EASE.out,
          stagger: 0.035,
          duration: 0.6,
          scrollTrigger: { trigger: el, start: "top 70%", end: "center 45%", scrub: 0.5 },
        }
      );
    }, el);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Scene id="studio" tone="sun">
      <div ref={root}>
        <p className="poster poster--l">
          <Words text={STATEMENT} />
        </p>
        <Group className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="poster-script script-inline md:col-span-4" data-reveal="script">
            honestly
          </p>
          <p className="lede max-w-[46ch] text-ink-dim md:col-span-7 md:col-start-6" data-reveal="fade">
            {SECOND}
          </p>
        </Group>
      </div>
    </Scene>
  );
}
