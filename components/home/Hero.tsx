"use client";

import { useEffect, useRef } from "react";
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
 * 01 — the hero: three acts on one scroll (motion #17).
 *
 * The poster: the headline condenses into place as its letters rise, the
 * pointer leaves a trail of work, the reel sits as a tilted sticker.
 * The takeover: the copy lifts out, the sticker straightens and opens to
 * the whole viewport, and one thing arrives on it, the ask to watch.
 * The curtain: the reel holds still and the page slides up over it.
 *
 * The hero is sticky inside a taller track and the next section overlaps
 * the track's tail, so the curtain needs no pin and no script at all; JS
 * adds only the scrub. Under reduced motion the track collapses and the
 * hero is a single, still viewport.
 */
export default function Hero() {
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const over = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
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

    // The overlay exists only for the takeover. It stays out of the document
    // until the scrub can bring it in, so nothing invisible can take focus.
    const overlay = over.current;
    if (overlay) overlay.hidden = false;

    // The takeover, scrubbed over the first viewport of scroll. The copy is
    // gone in the first fifth, before the video is anything but a sticker,
    // so ink never sits half-faded over a moving picture.
    const scrub = gsap.context(() => {
      gsap.set(".hero-over", { autoAlpha: 0 });
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=100%", scrub: 0.5 },
          defaults: { ease: "none" },
        })
        .to(".hero-copy", { y: -80, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0)
        .to(".hero-poster .poster-row", { yPercent: -25, duration: 0.2, ease: "power2.in", stagger: 0.03 }, 0)
        .to(".hero-trail", { autoAlpha: 0, duration: 0.12 }, 0)
        .to(".hero-tag", { autoAlpha: 0, duration: 0.12 }, 0.08)
        .to(".hero-reel", { clipPath: "inset(0% 0% 0% 0%)", rotation: 0, duration: 0.68, ease: "power2.inOut" }, 0.1)
        .to(".hero-reel video", { scale: 1, duration: 0.68, ease: "power2.inOut" }, 0.1)
        .to(".hero-scrim", { opacity: 0.35, duration: 0.3 }, 0.5)
        .to(".hero-over", { autoAlpha: 1, duration: 0.2 }, 0.74)
        .from(".hero-over > *", { y: 28, duration: 0.26, ease: EASE.out, stagger: 0.06 }, 0.74);
    }, el);

    // The sticker leans a few pixels against the cursor, only while it is a
    // sticker: once it starts opening it settles and stops listening.
    const lean = gsap.context(() => {
      const qx = gsap.quickTo(".hero-reel", "x", { duration: 0.6, ease: "power3" });
      const qy = gsap.quickTo(".hero-reel", "y", { duration: 0.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const opening = (window.scrollY || 0) > window.innerHeight * 0.12;
        if (opening) {
          qx(0);
          qy(0);
          return;
        }
        qx(-(e.clientX / window.innerWidth - 0.5) * 18);
        qy(-(e.clientY / window.innerHeight - 0.5) * 12);
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    }, el);

    const reveal = whenIntroDone(() =>
      gsap.context(() => {
        // The headline condenses into place as its letters land.
        gsap.fromTo(".hero-copy .poster--xl", { "--wdth": 118 }, { "--wdth": 62, duration: DUR.reveal * 1.5, ease: EASE.out });
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
      if (overlay) overlay.hidden = true;
    };
  }, []);

  return (
    <div ref={track} className="hero-track">
      <section className="hero">
        {/* React Bits ImageTrail: the pointer leaves the work behind it. */}
        <ImageTrail items={TRAIL} threshold={110} size={190} className="hero-trail" />

        {/* The reel: a tilted sticker that opens to the viewport on scroll. */}
        <div className="hero-reel">
          <div className="hero-reel-inner">
            <video ref={video} src={site.showreel} poster={site.showreelPoster} muted loop playsInline preload="none" aria-hidden />
            {/* Flat ink under the type, so paper on a moving picture stays legible. */}
            <div className="hero-scrim" aria-hidden />
            <div ref={over} className="hero-over" hidden>
              <p className="micro">showreel, 2024–25</p>
              <Magnet padding={60} magnetStrength={3}>
                <button type="button" onClick={openReel} className="button button--paper">
                  Watch the reel
                </button>
              </Magnet>
            </div>
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
    </div>
  );
}
