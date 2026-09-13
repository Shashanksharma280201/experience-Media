"use client";

/**
 * React Bits — ScrollStack, adapted to read the page's own scroll (the site
 * already runs Lenis) instead of creating a second Lenis. Cards pin under one
 * another as they reach `stackPosition`, each settling slightly smaller.
 */
import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = "" }) => (
  <div className={`scroll-stack-card relative w-full origin-top ${itemClassName}`.trim()} style={{ backfaceVisibility: "hidden" }}>
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  onStackComplete,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);
  const last = useRef(new Map<number, string>());
  const done = useRef(false);

  const pct = useCallback((v: string, h: number) => (v.includes("%") ? (parseFloat(v) / 100) * h : parseFloat(v)), []);
  const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

  const update = useCallback(() => {
    if (!cards.current.length) return;
    const scrollTop = window.scrollY;
    const h = window.innerHeight;
    const stackPx = pct(stackPosition, h);
    const scaleEndPx = pct(scaleEndPosition, h);
    const end = root.current?.querySelector<HTMLElement>(".scroll-stack-end");
    const endTop = end ? top(end) : 0;

    cards.current.forEach((card, i) => {
      const cardTop = top(card) - parseFloat(card.dataset.ty || "0");
      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;
      const pinStart = triggerStart;
      const pinEnd = endTop - h / 2;
      const p = scrollTop < triggerStart ? 0 : scrollTop > triggerEnd ? 1 : (scrollTop - triggerStart) / (triggerEnd - triggerStart);
      const scale = 1 - p * (1 - (baseScale + i * itemScale));
      const rot = rotationAmount ? i * rotationAmount * p : 0;
      let ty = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) ty = scrollTop - cardTop + stackPx + itemStackDistance * i;
      else if (scrollTop > pinEnd) ty = pinEnd - cardTop + stackPx + itemStackDistance * i;
      const t = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
      if (last.current.get(i) !== t) {
        card.style.transform = t;
        card.dataset.ty = String(ty);
        last.current.set(i, t);
      }
      if (i === cards.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !done.current) {
          done.current = true;
          onStackComplete?.();
        } else if (!inView && done.current) done.current = false;
      }
    });
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, onStackComplete, pct]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    // Under reduced motion the cards are simply there, in order; a pinned
    // stack would leave every card but the last unreadable.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cache = last.current;
    cards.current = Array.from(el.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    cards.current.forEach((card, i) => {
      if (i < cards.current.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.transformOrigin = "top center";
    });
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cards.current.forEach((c) => {
        c.style.transform = "";
        c.style.marginBottom = "";
      });
      cards.current = [];
      cache.clear();
    };
  }, [itemDistance, update]);

  return (
    <div ref={root} className={`relative w-full ${className}`.trim()}>
      {children}
      {/* Spacer so the last pin can release cleanly */}
      <div className="scroll-stack-end h-px w-full" />
    </div>
  );
};

export default ScrollStack;
