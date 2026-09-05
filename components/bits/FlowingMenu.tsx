"use client";

/**
 * React Bits — FlowingMenu, adapted to the site's tokens and split in two:
 * `FlowingRow` is one row with the hover marquee, usable around any resting
 * content; `FlowingMenu` composes rows into the menu.
 */
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface FlowingItem {
  link: string;
  text: string;
  image?: string;
  marquee?: string;
}

interface FlowingRowProps {
  link: string;
  marquee: string;
  image?: string;
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

export const FlowingRow: React.FC<FlowingRowProps> = ({ link, marquee, image, speed = 14, className = "", children }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [reps, setReps] = useState(4);
  const defaults = { duration: 0.6, ease: "expo" };

  const edge = (x: number, y: number, w: number, h: number): "top" | "bottom" => {
    const top = (x - w / 2) ** 2 + y ** 2;
    const bottom = (x - w / 2) ** 2 + (y - h) ** 2;
    return top < bottom ? "top" : "bottom";
  };

  useEffect(() => {
    const calc = () => {
      const part = innerRef.current?.querySelector<HTMLElement>(".marquee-part");
      if (!part) return;
      setReps(Math.max(4, Math.ceil(window.innerWidth / part.offsetWidth) + 2));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [marquee, image]);

  useEffect(() => {
    const t = setTimeout(() => {
      const part = innerRef.current?.querySelector<HTMLElement>(".marquee-part");
      if (!innerRef.current || !part || !part.offsetWidth) return;
      tween.current?.kill();
      tween.current = gsap.to(innerRef.current, { x: -part.offsetWidth, duration: speed, ease: "none", repeat: -1 });
    }, 50);
    return () => {
      clearTimeout(t);
      tween.current?.kill();
    };
  }, [marquee, image, reps, speed]);

  const onEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !innerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const e = edge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height);
    gsap
      .timeline({ defaults })
      .set(marqueeRef.current, { y: e === "top" ? "-101%" : "101%" }, 0)
      .set(innerRef.current, { y: e === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, innerRef.current], { y: "0%" }, 0);
  };
  const onLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !innerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const e = edge(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height);
    gsap
      .timeline({ defaults })
      .to(marqueeRef.current, { y: e === "top" ? "-101%" : "101%" }, 0)
      .to(innerRef.current, { y: e === "top" ? "101%" : "-101%" }, 0);
  };

  return (
    <div ref={itemRef} className={`flow-row relative overflow-hidden ${className}`}>
      <Link href={link} className="flow-face block" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {children}
      </Link>
      <div ref={marqueeRef} className="flow-marquee pointer-events-none absolute left-0 top-0 h-full w-full translate-y-[101%] overflow-hidden" aria-hidden>
        <div className="flex h-full w-fit" ref={innerRef}>
          {[...Array(reps)].map((_, i) => (
            <div className="marquee-part flex flex-shrink-0 items-center" key={i}>
              <span className="flow-marquee-text whitespace-nowrap">{marquee}</span>
              {image && <div className="flow-marquee-image bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FlowingMenu: React.FC<{ items?: FlowingItem[]; speed?: number }> = ({ items = [], speed = 14 }) => (
  <nav className="flow-menu">
    {items.map((item) => (
      <FlowingRow key={item.link} link={item.link} marquee={item.marquee ?? item.text} image={item.image} speed={speed}>
        <span className="flow-title poster poster--m">{item.text}</span>
      </FlowingRow>
    ))}
  </nav>
);

export default FlowingMenu;
