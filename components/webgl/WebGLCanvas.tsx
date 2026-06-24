"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier, type Tier } from "@/lib/webgl-capability";
import Multiverse from "./Multiverse";
import Effects from "./Effects";

export default function WebGLCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  if (tier === null || tier === "off") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        className="!pointer-events-auto"
        dpr={[1, tier === "high" ? 2 : 1.5]}
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: tier === "high", powerPreference: "high-performance" }}
      >
        <Multiverse tier={tier} />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
