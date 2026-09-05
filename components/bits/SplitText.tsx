"use client";

/**
 * React Bits — SplitText, adapted: each character rises out of its own mask
 * (GSAP SplitText's `mask`), the trigger can wait for the load sequence, and
 * under reduced motion the text is simply there.
 */
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { prefersReducedMotion, whenIntroDone } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  /** "enter": on scroll into view; "intro": after the loader; "now": on mount. */
  start?: "enter" | "intro" | "now";
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  onComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 30,
  duration = 1.1,
  ease = "expo.out",
  splitType = "chars",
  from = { yPercent: 110 },
  to = { yPercent: 0 },
  threshold = 0.15,
  start = "enter",
  tag = "p",
  onComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const done = useRef(onComplete);

  useEffect(() => {
    done.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text || prefersReducedMotion()) return;

    let split: GSAPSplitText | undefined;
    const build = () =>
      gsap.context(() => {
        split = new GSAPSplitText(el, {
          type: splitType === "chars" ? "chars,words" : "words",
          mask: splitType,
          smartWrap: true,
          reduceWhiteSpace: false,
          onSplit: (self: GSAPSplitText) => {
            const targets = splitType === "chars" ? self.chars : self.words;
            return gsap.fromTo(
              targets,
              { ...from },
              {
                ...to,
                duration,
                ease,
                stagger: delay / 1000,
                force3D: true,
                onComplete: () => done.current?.(),
                scrollTrigger: start === "enter" ? { trigger: el, start: `top ${(1 - threshold) * 100}%`, once: true } : undefined,
              }
            );
          },
        });
      }, el);

    const ready = document.fonts.status === "loaded" ? Promise.resolve() : document.fonts.ready;
    let ctx: gsap.Context | undefined;
    let cancel = () => {};
    ready.then(() => {
      if (start === "intro") cancel = whenIntroDone(() => (ctx = build()));
      else ctx = build();
    });
    return () => {
      cancel();
      ctx?.revert();
      try {
        split?.revert();
      } catch {}
    };
  }, [text, delay, duration, ease, splitType, threshold, start]); // eslint-disable-line react-hooks/exhaustive-deps

  const Tag = tag;
  return (
    <Tag ref={ref as React.RefObject<HTMLParagraphElement>} className={`split-parent ${className}`}>
      {text}
    </Tag>
  );
};

export default SplitText;
