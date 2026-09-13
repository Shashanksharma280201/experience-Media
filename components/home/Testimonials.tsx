"use client";

import { useEffect, useRef, useState } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import CardSwap, { Card } from "@/components/bits/CardSwap";
import { testimonials } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * 08 — what people say, as a dealt deck (React Bits CardSwap). Seven paper
 * cards in a skewed stack deal themselves every few seconds, or on a click;
 * the front card's words are set large beside the deck, verbatim, and swap
 * with a mask rise as the deck turns.
 */
export default function Testimonials() {
  const [front, setFront] = useState(0);
  const text = useRef<HTMLDivElement>(null);
  const t = testimonials[front];

  // The reading copy swaps with a rise whenever the deck turns.
  useEffect(() => {
    const el = text.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".voice-line", { yPercent: 110 }, { yPercent: 0, duration: DUR.slow, ease: EASE.out, stagger: 0.06 });
    }, el);
    return () => ctx.revert();
  }, [front]);

  return (
    <Scene tone="rose">
      <Group>
        <Poster lines={["In their", "words."]} script="really" scriptLine={0} />
      </Group>

      <div className="mt-12 grid items-center gap-12 md:mt-16 md:grid-cols-12">
        {/* The words, readable at any size. */}
        <div ref={text} className="md:col-span-6" aria-live="polite">
          <p className="num" aria-hidden>
            {String(front + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </p>
          <blockquote className="mt-4">
            <span className="mask-line">
              <span className="voice-line display-m">{t.quote}</span>
            </span>
          </blockquote>
          <figcaption className="mt-6">
            <span className="mask-line">
              <span className="voice-line font-display text-ink [font-variation-settings:'wdth'_104,'wght'_600]">
                {t.author}
                {t.role && <span className="small ml-3 text-ink-dim">{t.role}</span>}
              </span>
            </span>
          </figcaption>
          <p className="small mt-8 text-ink-dim">Click the deck to deal the next one.</p>
        </div>

        {/* The deck. Decorative twin of the words above. */}
        <Group className="deck-wrap md:col-span-6" aria-hidden>
          <div className="deck-stage" data-reveal="fade">
            <CardSwap width="100%" height="100%" cardDistance={44} verticalDistance={56} delay={6000} pauseOnHover skewAmount={5} onFront={setFront}>
              {testimonials.map((v, i) => (
                <Card key={v.author} customClass={`deck-card--${i}`}>
                  <span className="deck-quote">“</span>
                  <p className="deck-text">{v.quote}</p>
                  <div className="deck-foot">
                    <span className="deck-author">{v.author}</span>
                    <span className="deck-stars">{"✦".repeat(v.rating)}</span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </Group>
      </div>
    </Scene>
  );
}
