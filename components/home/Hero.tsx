"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import ImageTrail from "@/components/bits/ImageTrail";
import { disciplines, site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";
import { openReel } from "@/lib/reel";

// DRAFT COPY — written for shape and rhythm, flagged for review.
const HEADLINE = ["We make", "things people", "finish watching."];

/** Twelve frames for the trail, two per discipline, mixed. */
const TRAIL = Array.from({ length: 3 }, (_, k) => disciplines.map((d) => d.items[(k * 2) % d.items.length].thumb)).flat().slice(0, 12);

/**
 * 01 — the hero. The poster headline condenses into place as its letters
 * rise; the pointer leaves a trail of work behind it; the reel sits as a
 * tilted sticker that slaps in, leans against the cursor, and opens to the
 * full viewport on scroll. `portrait` is resolved by the page at build time.
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
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
      io.observe(v);
    };
    const stopWaiting = reduced ? () => {} : whenIntroDone(start);
    if (reduced) return () => io?.disconnect();

    // Motion #17 — the reel takes the viewport. Pinned; the sticker
    // straightens and its window opens as you scroll, the copy lifts out.
    const scrub = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.6 },
          defaults: { ease: "none" },
        })
        .to(".hero-reel", { clipPath: "inset(0% 0% 0% 0%)", rotation: 0, ease: "power2.inOut", duration: 1 }, 0)
        .to(".hero-reel video", { scale: 1, duration: 1 }, 0)
        .to(".hero-copy", { y: -80, opacity: 0, duration: 0.55 }, 0)
        .to(".hero-tag", { opacity: 0, duration: 0.2 }, 0)
        .to(".hero-caption", { opacity: 1, duration: 0.25 }, 0.75);
      if (portrait) gsap.to(".hero-portrait", { opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "+=55%", scrub: 0.6 } });
    }, el);

    // The sticker leans a few pixels against the cursor.
    const lean = gsap.context(() => {
      const qx = gsap.quickTo(".hero-reel", "x", { duration: 0.6, ease: "power3" });
      const qy = gsap.quickTo(".hero-reel", "y", { duration: 0.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        qx(-nx * 18);
        qy(-ny * 12);
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    }, el);

    const reveal = whenIntroDone(() =>
      gsap.context(() => {
        // The headline condenses into place as its letters land.
        gsap.fromTo(".hero-copy .poster--xl", { "--wdth": 118 }, { "--wdth": 62, duration: DUR.reveal * 1.5, ease: EASE.out });
        if (portrait) {
          gsap.from(".hero-portrait", { opacity: 0, scale: 1.06, transformOrigin: "70% 30%", duration: DUR.reveal * 1.4, ease: EASE.out });
          gsap.to(".hero-portrait-img", { yPercent: 14, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        }
        // The sticker slaps in after the words.
        gsap.from(".hero-reel-inner", { opacity: 0, scale: 1.3, rotation: 8, duration: 0.8, ease: "back.out(1.6)", delay: 0.7 });
        gsap.from(".hero-tag", { opacity: 0, x: -20, duration: DUR.base, ease: EASE.out, delay: 1.2 });
      }, el)
    );

    return () => {
      stopWaiting();
      io?.disconnect();
      reveal();
      lean.revert();
      scrub.revert();
    };
  }, [portrait]);

  return (
    <section ref={root} className="hero relative flex min-h-svh flex-col overflow-hidden">
      {portrait && (
        <div className="hero-portrait">
          <div className="hero-portrait-img">
            <Image src={portrait} alt={`${site.founder}, founder of ${site.name}`} fill priority sizes="(min-width: 768px) 64vw, 100vw" />
          </div>
        </div>
      )}

      {/* React Bits ImageTrail: the pointer leaves the work behind it. */}
      <ImageTrail items={TRAIL} threshold={110} size={190} className="hero-trail" />

      {/* The reel: a tilted sticker that opens to the viewport on scroll. */}
      <div className="hero-reel" aria-hidden>
        <div className="hero-reel-inner">
          <video ref={video} src={site.showreel} poster={site.showreelPoster} muted loop playsInline preload="none" />
          <p className="hero-caption micro">showreel, 2024–25</p>
        </div>
      </div>
      <span className="hero-tag poster-script" aria-hidden>
        showreel ▶
      </span>

      <Shell className="hero-copy relative flex flex-1 flex-col pb-[38svh] pt-28 md:pb-12 md:pt-20">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" size="xl" lines={HEADLINE} script="to the end" scriptLine={2} start="intro" className="hero-poster" />

          <div className="mt-6 md:mt-6 md:max-w-[52%]">
            <p className="lede max-w-[38ch] text-ink-dim" data-reveal="fade">
              A founder-led marketing agency. Strategy, always-on content and brand films for brands that need results, not decks.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal="fade">
              <Magnet padding={40} magnetStrength={3}>
                <button type="button" onClick={openReel} className="link-underline small text-ink">
                  Watch the reel
                </button>
              </Magnet>
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
