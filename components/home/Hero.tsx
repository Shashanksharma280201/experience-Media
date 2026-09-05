"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";
import { openReel } from "@/lib/reel";

// DRAFT COPY — written for shape and rhythm, flagged for review.
const HEADLINE = ["We make", "things people", "finish watching."];

/**
 * 01 — the hero. The poster headline, the reel in a window, the founder
 * behind. `portrait` is resolved by the page at build time so a missing file
 * renders the typographic hero rather than a broken image.
 */
export default function Hero({ portrait }: { portrait?: string }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    // The loop starts on the handoff, never before, and only spends decode
    // while on screen. Under reduced motion the poster is the frame.
    const v = video.current;
    let io: IntersectionObserver | undefined;
    let started = false;
    const start = () => {
      if (!v || started) return;
      started = true;
      v.preload = "auto";
      io = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
        { threshold: 0.05 }
      );
      io.observe(v);
    };
    const stopWaiting = reduced ? () => {} : whenIntroDone(start);
    if (reduced) return () => io?.disconnect();

    // Motion #17 — the reel takes the viewport. Pinned; the window opens as
    // you scroll, the copy lifts out, the frame settles from a slight zoom.
    const scrub = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.6 },
          defaults: { ease: "none" },
        })
        .to(".hero-reel", { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, 0)
        .to(".hero-reel video", { scale: 1, duration: 1 }, 0)
        .to(".hero-copy", { y: -80, opacity: 0, duration: 0.55 }, 0)
        .to(".hero-portrait", { opacity: 0, duration: 0.5 }, 0)
        .to(".hero-caption", { opacity: 1, duration: 0.25 }, 0.75);
    }, el);

    const reveal = whenIntroDone(() =>
      gsap.context(() => {
        gsap.from(".hero-portrait", {
          opacity: 0,
          scale: 1.06,
          transformOrigin: "70% 30%",
          duration: DUR.reveal * 1.4,
          ease: EASE.out,
        });
        gsap.to(".hero-portrait-img", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.from(".hero-reel-inner", {
          opacity: 0,
          scale: 1.04,
          duration: DUR.reveal,
          ease: EASE.out,
          delay: 0.6,
        });
      }, el)
    );

    return () => {
      stopWaiting();
      io?.disconnect();
      reveal();
      scrub.revert();
    };
  }, []);

  return (
    <section ref={root} className="hero relative flex min-h-svh flex-col overflow-hidden">
      {portrait && (
        <div className="hero-portrait">
          <div className="hero-portrait-img">
            <Image
              src={portrait}
              alt={`${site.founder}, founder of ${site.name}`}
              fill
              priority
              sizes="(min-width: 768px) 64vw, 100vw"
            />
          </div>
        </div>
      )}

      {/* The reel: a full-viewport loop, clipped to a window until scrolled. */}
      <div className="hero-reel" aria-hidden>
        <div className="hero-reel-inner">
          <video ref={video} src={site.showreel} poster={site.showreelPoster} muted loop playsInline preload="none" />
          <p className="hero-caption micro">showreel, 2024–25</p>
        </div>
      </div>

      <Shell className="hero-copy relative flex flex-1 flex-col pb-[38svh] pt-28 md:pb-20 md:pt-32">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" size="xl" lines={HEADLINE} script="to the end" scriptLine={2} />

          <div className="mt-8 md:mt-10 md:max-w-[52%]">
            <p className="lede max-w-[38ch] text-ink-dim" data-reveal="fade">
              A founder-led marketing agency. Strategy, always-on content and brand films for
              brands that need results, not decks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal="fade">
              <button type="button" onClick={openReel} className="link-underline small text-ink">
                Watch the reel
              </button>
              <p className="hero-cue small flex items-center gap-3 text-ink-faint">
                <span aria-hidden className="block h-8 w-px animate-[cue_2.4s_ease-in-out_infinite] bg-signal" />
                Scroll
              </p>
            </div>
          </div>
        </Group>
      </Shell>
    </section>
  );
}
