"use client";

/**
 * React Bits — ScrollVelocity, ported from motion/react to GSAP's ticker so
 * the site keeps one animation library. Same behaviour: the rows slide on
 * their own, speed up with the scroll, and reverse when the scroll does.
 */
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface ScrollVelocityProps {
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  damping?: number;
}

function VelocityRow({
  children,
  baseVelocity,
  className,
  numCopies,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  damping,
}: {
  children: React.ReactNode;
  baseVelocity: number;
  className: string;
  numCopies: number;
  velocityMapping: VelocityMapping;
  parallaxClassName: string;
  scrollerClassName: string;
  damping: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let copyWidth = copy.current?.offsetWidth ?? 0;
    const measure = () => {
      copyWidth = copy.current?.offsetWidth ?? 0;
    };
    window.addEventListener("resize", measure);
    const map = gsap.utils.mapRange(velocityMapping.input[0], velocityMapping.input[1], velocityMapping.output[0], velocityMapping.output[1]);
    let x = 0;
    let lastY = window.scrollY;
    let smoothV = 0;
    let dir = 1;
    const tick = (_t: number, deltaMs: number) => {
      const y = window.scrollY;
      const raw = ((y - lastY) / Math.max(deltaMs, 1)) * 1000; // px per second
      lastY = y;
      smoothV += (raw - smoothV) * Math.min(1, deltaMs / damping);
      const factor = map(smoothV);
      if (factor < 0) dir = -1;
      else if (factor > 0) dir = 1;
      if (!copyWidth) return;
      let moveBy = dir * baseVelocity * (deltaMs / 1000);
      moveBy += dir * moveBy * Math.abs(factor);
      x = gsap.utils.wrap(-copyWidth, 0, x + moveBy);
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, [baseVelocity, damping, velocityMapping]);

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copy : null} aria-hidden={i > 0 ? true : undefined}>
        {children}&nbsp;
      </span>
    );
  }

  return (
    <div className={`${parallaxClassName} relative overflow-hidden`}>
      <div ref={scroller} className={`${scrollerClassName} flex whitespace-nowrap will-change-transform`}>
        {spans}
      </div>
    </div>
  );
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 100,
  className = "",
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "",
  scrollerClassName = "",
  damping = 120,
}) => (
  <div>
    {texts.map((text, index) => (
      <VelocityRow
        key={index}
        className={className}
        baseVelocity={index % 2 !== 0 ? -velocity : velocity}
        numCopies={numCopies}
        velocityMapping={velocityMapping}
        parallaxClassName={parallaxClassName}
        scrollerClassName={scrollerClassName}
        damping={damping}
      >
        {text}
      </VelocityRow>
    ))}
  </div>
);

export default ScrollVelocity;
