"use client";

import { createElement, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: React.ReactNode;
  className?: string;
  /** stagger direct children instead of animating the whole block */
  stagger?: boolean;
  delay?: number;
  y?: number;
  as?: React.ElementType;
};

export default function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 28,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        delay,
        ease: "expo.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, y]);

  return createElement(Tag, { ref, className }, children);
}
