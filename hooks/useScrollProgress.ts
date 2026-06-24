"use client";

import { createContext, createElement, useContext, useEffect, useRef } from "react";

const ScrollProgressContext =
  createContext<React.MutableRefObject<number> | null>(null);

export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      progress.current = max > 0 ? el.scrollTop / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return createElement(ScrollProgressContext.Provider, { value: progress }, children);
}

export function useScrollProgress() {
  const ctx = useContext(ScrollProgressContext);
  if (!ctx) throw new Error("useScrollProgress must be used within ScrollProgressProvider");
  return ctx;
}
