"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import {
  getServerTierSnapshot,
  getTierSnapshot,
  subscribeTier,
} from "@/lib/webgl-capability";
import { useScrollEffect } from "@/hooks/useScrollProgress";
import Multiverse from "./Multiverse";
import Effects from "./Effects";
import type { CameraMode } from "./CameraRig";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A fixed, full-viewport scene behind the DOM. Renders only while `anchorId`
 * is on screen; the loop is frozen otherwise so it costs nothing off-screen.
 */
export default function WebGLScene({
  mode,
  anchorId,
}: {
  mode: CameraMode;
  /** Element whose travel through the viewport drives the camera. */
  anchorId?: string;
}) {
  const tier = useSyncExternalStore(
    subscribeTier,
    getTierSnapshot,
    getServerTierSnapshot
  );
  const [visible, setVisible] = useState(false);
  const progress = useRef(0);

  // Without an anchor the scene backs the whole page and always runs.
  const active = anchorId ? visible : true;

  // Single scroll reader → local progress for this scene.
  useScrollEffect((s) => {
    if (!anchorId) {
      progress.current = s.page;
      return;
    }
    const el = document.getElementById(anchorId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const span = rect.height + window.innerHeight;
    progress.current = span > 0 ? clamp01((window.innerHeight - rect.top) / span) : 0;
  });

  useEffect(() => {
    if (tier === "off" || !anchorId) return;

    let io: IntersectionObserver | null = null;
    let raf = 0;
    const attach = () => {
      const el = document.getElementById(anchorId);
      if (!el) {
        raf = requestAnimationFrame(attach);
        return;
      }
      io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
        rootMargin: "25% 0px",
      });
      io.observe(el);
    };
    attach();
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [tier, anchorId]);

  if (tier === "off") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        className="!pointer-events-auto"
        frameloop={active ? "always" : "never"}
        dpr={[1, tier === "high" ? 1.5 : 1]}
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Multiverse tier={tier} progressRef={progress} mode={mode} />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
