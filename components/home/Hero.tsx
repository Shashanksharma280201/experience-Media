"use client";

import { useEffect, useRef } from "react";
import Shell from "@/components/layout/Shell";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";

// DRAFT COPY — written for shape and rhythm, flagged for review.
const HEADLINE = ["We make things", "people finish", "watching."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const play = () => {
      if (prefersReducedMotion()) return; // content is already at rest state
      const ctx = gsap.context(() => {
        // Motion #3 — line-by-line mask reveal.
        //
        // `from()` rather than a CSS start state on purpose: Tailwind v4 writes
        // `translate-y-*` to the standalone `translate` property, which composes
        // with GSAP's `transform` instead of being overridden by it — the lines
        // would never come back up. This also leaves the copy visible if JS
        // never runs.
        gsap.from(".hero-line > span", {
          yPercent: 110,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger: 0.09,
        });
        gsap.from(".hero-fade", {
          opacity: 0,
          y: 12,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.08,
          delay: 0.35,
        });
      }, el);
      return ctx;
    };

    // Hold until the load sequence has cleared, so the two don't overlap.
    const root_ = document.documentElement;
    if (root_.classList.contains("intro-done") || prefersReducedMotion()) {
      const ctx = play();
      return () => ctx?.revert();
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const obs = new MutationObserver(() => {
      if (root_.classList.contains("intro-done")) {
        obs.disconnect();
        ctx = play();
      }
    });
    obs.observe(root_, { attributes: true, attributeFilter: ["class"] });
    return () => {
      obs.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-20"
    >
      {/* Accent use #1 of 5 — first of the two ambient glows on this page. */}
      <div
        aria-hidden
        className="ambient left-[-10%] top-[8%] h-[70vmin] w-[80vmin] animate-[intro-breathe_14s_ease-in-out_infinite_alternate]"
      />

      <Shell className="relative">
        <p className="micro hero-fade">
          Experience Media — video and content, New Delhi
        </p>

        <h1 className="display-xl mt-8 md:mt-10">
          {HEADLINE.map((line) => (
            <span key={line} className="mask-line hero-line">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <p className="lede hero-fade max-w-[38ch] text-bone-dim md:col-span-6">
            Founder-led video, motion and post for brands that need output,
            not decks.
          </p>

          {/* Accent use #4 of 5 — the scroll cue. */}
          <p className="hero-fade small flex items-center gap-3 text-bone-faint md:col-span-3 md:col-start-10 md:justify-end">
            <span
              aria-hidden
              className="block h-8 w-px animate-[cue_2.4s_ease-in-out_infinite] bg-signal"
            />
            Scroll
          </p>
        </div>
      </Shell>
    </section>
  );
}
