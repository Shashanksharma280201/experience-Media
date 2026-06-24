"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier, type Tier } from "@/lib/webgl-capability";
import Multiverse from "./Multiverse";
import Effects from "./Effects";

export default function WebGLCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);
  // Render only while the hero region is on screen; freeze the loop otherwise.
  const [active, setActive] = useState(true);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  useEffect(() => {
    if (tier === null || tier === "off") return;
    let io: IntersectionObserver | null = null;
    const attach = () => {
      const el = document.getElementById("hero-scroll");
      if (!el) {
        requestAnimationFrame(attach);
        return;
      }
      io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
        rootMargin: "10% 0px",
      });
      io.observe(el);
    };
    attach();
    return () => io?.disconnect();
  }, [tier]);

  if (tier === null || tier === "off") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        className="!pointer-events-auto"
        frameloop={active ? "always" : "never"}
        dpr={[1, tier === "high" ? 1.5 : 1]}
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Multiverse tier={tier} active={active} />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
