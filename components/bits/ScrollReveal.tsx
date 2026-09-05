"use client";

/**
 * React Bits — ScrollReveal, adapted: cleanup is scoped to its own tweens
 * (the original killed every ScrollTrigger on the page), and the type is
 * left to the caller.
 */
import React, { useEffect, useRef, useMemo, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  as?: "p" | "blockquote" | "div";
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  as: Tag = "div",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { transformOrigin: "0% 50%", rotate: baseRotation }, { ease: "none", rotate: 0, scrollTrigger: { trigger: el, start: "top bottom", end: rotationEnd, scrub: true } });
      const words = el.querySelectorAll<HTMLElement>(".word");
      gsap.fromTo(words, { opacity: baseOpacity }, { ease: "none", opacity: 1, stagger: 0.05, scrollTrigger: { trigger: el, start: "top bottom-=20%", end: wordAnimationEnd, scrub: true } });
      if (enableBlur) {
        gsap.fromTo(words, { filter: `blur(${blurStrength}px)` }, { ease: "none", filter: "blur(0px)", stagger: 0.05, scrollTrigger: { trigger: el, start: "top bottom-=20%", end: wordAnimationEnd, scrub: true } });
      }
    }, el);
    return () => ctx.revert();
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <Tag className={textClassName}>{splitText}</Tag>
    </div>
  );
};

export default ScrollReveal;
