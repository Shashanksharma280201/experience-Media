"use client";

import { useEffect, useRef } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// §4.03 of the brief.
const STATEMENT = "We started as creators. So we understand the audience.";
const COPY = [
  "Most agencies understand brands. Most creators understand audiences. We built Experience Media by living on both sides.",
  "We started with editing, freelancing and content creation — learning what makes people stop, watch, share and remember.",
  "Today, we combine that creator instinct with strategy, production and distribution to build content systems designed for both the algorithm and the audience.",
];
const LARGE = ["Strategy. Production.", "Distribution. One system."];

/**
 * Every word in its own mask, so the statement can rise word by word. The
 * last word is the anchor for the script, so "honestly" sits just past the
 * full stop the way every poster's script sits at the end of its line.
 */
function Words({ text, script }: { text: string; script: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const last = i === words.length - 1;
        return (
          <span key={`${w}-${i}`} className={last ? "poster-anchor" : undefined}>
            <span className="word-mask">
              <span className="pw">{w}</span>
            </span>
            {last ? (
              <span aria-hidden className="poster-script statement-script">
                {script}
              </span>
            ) : (
              " "
            )}
          </span>
        );
      })}
    </>
  );
}

/**
 * 03 — what we believe. The statement as a full-width poster on the sun
 * tint; its words rise out of their masks with the scroll (motion #7), and
 * once the last one has landed the script writes itself in after it.
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
      // The script, on its own clock, as the last words are landing.
      gsap.fromTo(
        ".statement-script",
        { clipPath: "inset(-30% 100% -30% -10%)" },
        {
          clipPath: "inset(-30% -10% -30% -10%)",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "center 55%", once: true },
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
          <Words text={STATEMENT} script="honestly" />
        </p>
        <Group className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            {COPY.map((p, i) => (
              <p key={i} className={`lede max-w-[46ch] text-ink-dim ${i > 0 ? "mt-6" : ""}`} data-reveal="fade">
                {p}
              </p>
            ))}
          </div>
        </Group>
        <Group className="mt-16 md:mt-24">
          <Poster as="p" size="m" lines={LARGE} />
        </Group>
      </div>
    </Scene>
  );
}
