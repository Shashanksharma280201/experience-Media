"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ScrollState = {
  /** 0..1 across the whole document. */
  page: number;
  /** 0..1 across the hero region (`#hero`), 0 when absent. */
  hero: number;
};

type Listener = (s: ScrollState) => void;

type Store = {
  get: () => ScrollState;
  publish: (next: ScrollState) => void;
  subscribe: (fn: Listener) => () => void;
};

const ScrollContext = createContext<Store | null>(null);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** State lives in the closure, so nothing mutates the object React holds. */
function createStore(): Store {
  let state: ScrollState = { page: 0, hero: 0 };
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    publish(next) {
      state = next;
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

/**
 * The single scroll reader. Everything that reacts to scroll — the scrubber,
 * the hero's type axis, the camera rigs — subscribes here rather than attaching
 * its own listener and running its own layout reads every frame.
 */
export function ScrollProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initialiser: created once, stable, and not a ref read during render.
  const [store] = useState(createStore);

  useEffect(() => {
    let queued = false;

    const measure = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const page = max > 0 ? clamp01(doc.scrollTop / max) : 0;

      let hero = 0;
      const el = document.getElementById("hero");
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        hero = total > 0 ? clamp01(-rect.top / total) : 0;
      }

      store.publish({ page, hero });
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [store]);

  return createElement(ScrollContext.Provider, { value: store }, children);
}

export function useScrollStore(): Store {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollStore must be used within ScrollProgressProvider");
  }
  return ctx;
}

/** Subscribe to scroll without re-rendering. */
export function useScrollEffect(fn: Listener) {
  const store = useScrollStore();
  const latest = useRef(fn);

  // Kept current in an effect, never written during render.
  useEffect(() => {
    latest.current = fn;
  });

  useEffect(() => {
    const unsub = store.subscribe((s) => latest.current(s));
    latest.current(store.get());
    return unsub;
  }, [store]);
}
