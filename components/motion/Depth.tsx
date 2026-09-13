"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The page's own scroll choreography, declared once for every scene.
 *
 * Two moves. A tinted scene's ground draws down over the paper as the scene
 * arrives, the way a rule draws (motion #12), so the colour is something
 * the visitor pulls in rather than a block they land on. And every scene
 * headline drifts a few percent slower than the page around it, which is
 * all the depth the poster wall needs.
 *
 * Both read the scroll and nothing else; under reduced motion neither
 * exists, and the grounds are simply full.
 */
export default function Depth() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".scene-ground").forEach((ground) => {
        gsap.fromTo(
          ground,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: { trigger: ground.parentElement, start: "top 95%", end: "top 30%", scrub: 0.6 },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".scene .poster--l").forEach((poster) => {
        const scene = poster.closest<HTMLElement>(".scene");
        if (!scene) return;
        gsap.fromTo(
          poster,
          { yPercent: 6 },
          { yPercent: -6, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 0.8 } }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
