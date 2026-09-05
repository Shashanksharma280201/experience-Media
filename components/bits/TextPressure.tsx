"use client";

/**
 * React Bits — TextPressure, adapted to Archivo, which the site already
 * self-hosts: its width axis runs 62–125 and weight 100–900, no italic. The
 * letters nearest the cursor go widest and heaviest.
 */
import { useEffect, useRef, useState, useCallback } from "react";

interface TextPressureProps {
  text?: string;
  width?: boolean;
  weight?: boolean;
  alpha?: boolean;
  flex?: boolean;
  className?: string;
  minFontSize?: number;
  as?: "h1" | "h2" | "p" | "div";
  label?: string;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(b.x - a.x, b.y - a.y);
const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const TextPressure: React.FC<TextPressureProps> = ({
  text = "Experience",
  width = true,
  weight = true,
  alpha = false,
  flex = true,
  className = "",
  minFontSize = 24,
  as: Tag = "p",
  label,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const chars = text.split("");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      mouseRef.current = { x: left + w / 2, y: top + h / 2 };
      cursorRef.current = { ...mouseRef.current };
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width: containerW } = containerRef.current.getBoundingClientRect();
    // Condensed caps: roughly 0.42em per glyph at wdth 62, so fit to width.
    setFontSize(Math.max(containerW / (chars.length * 0.68), minFontSize));
  }, [chars.length, minFontSize]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(t);
      t = setTimeout(setSize, 100);
    };
    setSize();
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, [setSize]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;
      if (titleRef.current) {
        const maxDist = titleRef.current.getBoundingClientRect().width / 2;
        spansRef.current.forEach((span) => {
          if (!span) return;
          const r = span.getBoundingClientRect();
          const d = dist(mouseRef.current, { x: r.x + r.width / 2, y: r.y + r.height / 2 });
          const wdth = width ? Math.floor(getAttr(d, maxDist, 62, 63)) : 62; // 62 → 125
          const wght = weight ? Math.floor(getAttr(d, maxDist, 500, 400)) : 800; // 500 → 900
          const a = alpha ? getAttr(d, maxDist, 0.4, 0.6).toFixed(2) : "1";
          const fvs = `"wdth" ${wdth}, "wght" ${wght}`;
          if (span.style.fontVariationSettings !== fvs) span.style.fontVariationSettings = fvs;
          if (alpha && span.style.opacity !== a) span.style.opacity = a;
        });
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, alpha]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <Tag
        ref={titleRef as React.RefObject<HTMLParagraphElement>}
        className={`${className} ${flex ? "flex justify-between" : ""} font-display uppercase`}
        style={{ fontSize, lineHeight: 0.86, margin: 0, fontVariationSettings: '"wdth" 62, "wght" 800' }}
      >
        <span className="sr-only">{label ?? text}</span>
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            aria-hidden
            className="inline-block"
            style={{ fontVariationSettings: '"wdth" 62, "wght" 800' }}
          >
            {char}
          </span>
        ))}
      </Tag>
    </div>
  );
};

export default TextPressure;
