"use client";

/**
 * React Bits — PixelTransition, adapted: fluid width, no dark chrome, and the
 * touch check runs in an effect so it renders on the server.
 */
import React, { useRef, useEffect, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
  /** Fill the positioned parent instead of sizing by aspect ratio. */
  fill?: boolean;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "56.25%",
  fill = false,
  className = "",
  style = {},
}) => {
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState(false);
  const touch = useRef(false);

  useEffect(() => {
    touch.current = "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  }, []);

  useEffect(() => {
    const grid = pixelGridRef.current;
    if (!grid) return;
    grid.innerHTML = "";
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel", "absolute", "hidden");
        pixel.style.backgroundColor = pixelColor;
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        grid.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean) => {
    setIsActive(activate);
    const grid = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!grid || !activeEl) return;
    const pixels = grid.querySelectorAll<HTMLDivElement>(".pixelated-image-card__pixel");
    if (!pixels.length) return;
    gsap.killTweensOf(pixels);
    delayedCallRef.current?.kill();
    gsap.set(pixels, { display: "none" });
    const each = animationStepDuration / pixels.length;
    gsap.to(pixels, { display: "block", duration: 0, stagger: { each, from: "random" } });
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });
    gsap.to(pixels, { display: "none", duration: 0, delay: animationStepDuration, stagger: { each, from: "random" } });
  };

  const enter = () => {
    if (touch.current) return;
    if (!isActive) animatePixels(true);
  };
  const leave = () => {
    if (touch.current) return;
    if (isActive && !once) animatePixels(false);
  };
  const click = () => {
    if (!touch.current) return;
    if (!isActive) animatePixels(true);
    else if (!once) animatePixels(false);
  };

  return (
    <div
      className={`${fill ? "absolute inset-0" : "relative w-full"} overflow-hidden ${className}`}
      style={style}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={click}
      onFocus={enter}
      onBlur={leave}
    >
      {!fill && <div style={{ paddingTop: aspectRatio }} />}
      <div className="absolute inset-0 h-full w-full" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div ref={activeRef} className="absolute inset-0 z-[2] h-full w-full" style={{ display: "none" }} aria-hidden={!isActive}>
        {secondContent}
      </div>
      <div ref={pixelGridRef} className="pointer-events-none absolute inset-0 z-[3] h-full w-full" />
    </div>
  );
};

export default PixelTransition;
