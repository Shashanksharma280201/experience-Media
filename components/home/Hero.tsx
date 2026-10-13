"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { clips, credibility, site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";
import { openReel } from "@/lib/reel";

// §4.01 of the brief.
const HEADLINE = ["We build content", "systems that make", "brands impossible", "to ignore."];

/**
 * 01 — the hero: the frame (motion #17).
 *
 * The footage fills the viewport from the first paint, under a flat ink
 * scrim; the headline sits bottom-left over it in paper and condenses into
 * place as its letters rise; the credibility strip and one round Watch
 * button follow.
 *
 * Scroll: over the first viewport the footage shrinks to a framed card at
 * the right, the scrim lifts, the copy leaves, and the paper page rises
 * under it. The hero is sticky inside a taller track and the next section
 * overlaps the track's tail, so the curtain needs no pin and no script.
 * Under reduced motion the track collapses and the hero is one still
 * viewport with the poster frame.
 */
export default function Hero() {
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    // The footage starts on the handoff, never before, and only spends
    // decode while on screen. Phones take the 720p cut.
    const v = video.current;
    let io: IntersectionObserver | undefined;
    let started = false;
    const start = () => {
      if (!v || started) return;
      started = true;
      if (window.matchMedia("(max-width: 767px)").matches) v.src = clips.heroSmall.src;
      v.preload = "auto";
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
      io.observe(v);
    };
    const stopWaiting = whenIntroDone(start);

    // The frame, scrubbed over the first viewport of scroll. The copy is
    // gone in the first fifth; the film is a card by the end.
    const scrub = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=100%", scrub: 0.5 },
          defaults: { ease: "none" },
        })
        .to(".hero-copy", { y: -60, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0)
        // Explicit start values: the arrival also tweens this, and a lazily
        // recorded start would otherwise be whatever the arrival had set.
        .fromTo(".hero-watch", { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.8, duration: 0.15 }, 0)
        .to(".hero-scrim", { opacity: 0, duration: 0.5 }, 0.1)
        .to(".hero-film", { clipPath: "inset(12% 4% 12% 52%)", duration: 0.75, ease: "power2.inOut" }, 0.15)
        .to(".hero-film video", { scale: 1.06, duration: 0.75, ease: "power2.inOut" }, 0.15);
    }, el);

    // The arrival, built now so its start states hold under the loader's
    // panel, and played on the handoff.
    let arrive = () => {};
    const reveal = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".hero-copy .poster--xl", { "--wdth": 118 }, { "--wdth": 62, duration: DUR.reveal * 1.5, ease: EASE.out }, 0);
      tl.from(".hero-strip > *", { opacity: 0, y: 10, duration: DUR.base, ease: EASE.out, stagger: 0.08 }, 0.9);
      tl.from(".hero-watch", { opacity: 0, scale: 0.6, duration: DUR.base, ease: "back.out(1.6)" }, 1.3);
      arrive = () => {
        tl.play();
      };
    }, el);
    const stopArrival = whenIntroDone(arrive);

    return () => {
      stopWaiting();
      stopArrival();
      io?.disconnect();
      reveal.revert();
      scrub.revert();
    };
  }, []);

  return (
    <div ref={track} className="hero-track">
      <section className="hero">
        {/* The footage. Under reduced motion only the poster paints. */}
        <div className="hero-film" aria-hidden>
          <video ref={video} src={clips.hero.src} poster={clips.hero.poster} muted loop playsInline preload="none" />
        </div>
        {/* Flat ink under the type, so paper on a moving picture stays legible. */}
        <div className="hero-scrim" aria-hidden />

        <Shell className="hero-copy relative flex flex-1 flex-col justify-end pb-[calc(var(--gutter)+0.5rem)] pt-28 md:pt-20">
          <Group onLoad stagger={0.07}>
            <Poster as="h1" size="xl" lines={HEADLINE} script="kingmakers" scriptLine={1} start="intro" className="hero-poster" />
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal="fade">
              <Magnet padding={40} magnetStrength={3}>
                <Link href="/contact" className="button button--paper">
                  Start a Project
                </Link>
              </Magnet>
              <Link href="/work" className="link-underline small text-paper">
                See Our Work →
              </Link>
            </div>
            <p className="hero-strip" aria-label={`Credibility: ${credibility.join(", ")}`}>
              {credibility.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          </Group>
        </Shell>

        <Magnet padding={60} magnetStrength={3}>
          <button type="button" onClick={openReel} className="hero-watch" aria-label={`Watch the ${site.name} showreel`}>
            <span>Watch</span>
            <span>reel</span>
          </button>
        </Magnet>
      </section>
    </div>
  );
}
