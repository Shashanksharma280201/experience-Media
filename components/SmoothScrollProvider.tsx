"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Hold the page still under the load sequence, the open menu, and the
    // reel player. Lenis scrolls programmatically, so `overflow: hidden`
    // alone would not stop it.
    const root = document.documentElement;

    // Refreshing reverts pins, which moves pinned elements in the DOM and
    // blurs whatever is focused inside them. Keyboard users would lose their
    // place after the intro and after the reel closes; hand focus back.
    const refresh = () => {
      const active = document.activeElement as HTMLElement | null;
      ScrollTrigger.refresh();
      if (active && active !== document.body && document.activeElement !== active && active.isConnected) {
        active.focus({ preventScroll: true });
      }
    };

    const isLocked = () =>
      root.classList.contains("intro-lock") || root.classList.contains("scroll-lock");
    let locked = isLocked();
    if (locked) lenis.stop();
    const obs = new MutationObserver(() => {
      const now = isLocked();
      if (now === locked) return;
      locked = now;
      if (now) {
        lenis.stop();
      } else {
        lenis.start();
        // Positions were measured under the lock; re-measure.
        refresh();
      }
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Pinned sections depend on final layout; images arriving shift it.
    const onLoad = () => refresh();
    window.addEventListener("load", onLoad);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      obs.disconnect();
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
