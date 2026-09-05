"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion } from "@/lib/gsap";
import { REEL_OPEN } from "@/lib/reel";

/**
 * Motion #22 — the full reel takes the viewport. Ink ground, sound on,
 * native controls (they are the most accessible ones there are). Escape or
 * the close button ends it; focus returns to whatever opened it.
 */
export default function ReelPlayer() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      opener.current = (e as CustomEvent<HTMLElement | null>).detail ?? null;
      setOpen(true);
    };
    window.addEventListener(REEL_OPEN, onOpen);
    return () => window.removeEventListener(REEL_OPEN, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.classList.add("scroll-lock");
    closeBtn.current?.focus();
    video.current?.play().catch(() => {
      /* autoplay with sound can be refused; the controls are right there */
    });

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);

    const ctx = prefersReducedMotion()
      ? undefined
      : gsap.context(() => {
          gsap.from(root.current, { opacity: 0, duration: DUR.base, ease: EASE.out });
          gsap.from(video.current, {
            scale: 0.96,
            duration: DUR.reveal,
            ease: EASE.out,
          });
        });

    return () => {
      window.removeEventListener("keydown", onKey);
      html.classList.remove("scroll-lock");
      ctx?.revert();
      opener.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} showreel`}
      className="reel-player"
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={() => setOpen(false)}
        className="reel-close link-underline small"
      >
        Close
      </button>
      <video
        ref={video}
        src={site.showreelFull}
        poster={site.showreelPoster}
        controls
        playsInline
        preload="metadata"
        className="reel-video"
      />
    </div>
  );
}
