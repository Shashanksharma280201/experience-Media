"use client";

/**
 * React Bits — CardSwap, adapted: sized by its wrapper instead of pinned to
 * a corner, reports which card is in front, and holds still under reduced
 * motion. The front card drops, the rest step forward, the dropped one
 * returns to the back; elastic by default.
 */
import React, { Children, cloneElement, forwardRef, isValidElement, type ReactElement, type ReactNode, type RefObject, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  onFront?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`deck-card absolute left-1/2 top-1/2 [backface-visibility:hidden] [transform-style:preserve-3d] ${customClass ?? ""} ${rest.className ?? ""}`.trim()} />
));
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({ x: i * distX, y: -i * distY, z: -i * distX * 1.5, zIndex: total - i });
const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, xPercent: -50, yPercent: -50, skewY: skew, transformOrigin: "center center", zIndex: slot.zIndex, force3D: true });

const CardSwap: React.FC<CardSwapProps> = ({ width = 500, height = 400, cardDistance = 60, verticalDistance = 70, delay = 5000, pauseOnHover = false, onCardClick, onFront, skewAmount = 6, easing = "elastic", children }) => {
  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const onFrontRef = useRef(onFront);
  useEffect(() => {
    onFrontRef.current = onFront;
  }, [onFront]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => r.current && placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const swap = () => {
      if (order.current.length < 2) return;
      // One deal at a time: a click mid-animation would deal from a stale
      // order and fight the running timeline.
      if (tlRef.current?.isActive()) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;
      order.current = [...rest, front];
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.to(elFront, { y: "+=500", duration: config.durDrop, ease: config.ease });
      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });
      tl.call(() => onFrontRef.current?.(rest[0]), undefined, "promote");
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, "return");
    };

    intervalRef.current = window.setInterval(swap, delay);
    const node = container.current;
    const pause = () => {
      tlRef.current?.pause();
      clearInterval(intervalRef.current);
    };
    const resume = () => {
      tlRef.current?.play();
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(swap, delay);
    };
    const onClick = () => {
      if (tlRef.current?.isActive()) return;
      clearInterval(intervalRef.current);
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    };
    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
    }
    node?.addEventListener("click", onClick);
    return () => {
      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
      }
      node?.removeEventListener("click", onClick);
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]); // eslint-disable-line react-hooks/exhaustive-deps

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={container} className="deck relative [perspective:900px]" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
