"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Image } from "@react-three/drei";
import type { Group } from "three";
import {
  getServerTierSnapshot,
  getTierSnapshot,
  subscribeTier,
} from "@/lib/webgl-capability";
import { portfolio } from "@/lib/content";

/** A slow carousel of real work, contained in the capability panel. */
function Ring({ count }: { count: number }) {
  const group = useRef<Group>(null);

  const thumbs = useMemo(() => {
    const vfx = portfolio.find((c) => c.title === "VFX & CGI") ?? portfolio[0];
    return vfx.items.slice(0, count).map((it) => it.thumb);
  }, [count]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });

  const radius = 2.6;

  return (
    <group ref={group}>
      {thumbs.map((thumb, i) => {
        const a = (i / thumbs.length) * Math.PI * 2;
        return (
          <group
            key={`${thumb}-${i}`}
            position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
            rotation={[0, a, 0]}
          >
            {/* drei's <Image> is a three.js mesh, not an <img> */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image url={thumb} scale={[2.1, 1.2]} transparent />
          </group>
        );
      })}
    </group>
  );
}

export default function VfxPanel() {
  const tier = useSyncExternalStore(
    subscribeTier,
    getTierSnapshot,
    getServerTierSnapshot
  );

  // Reduced motion / no WebGL: the panel simply isn't rendered, and
  // Capabilities falls back to the static service artwork.
  if (tier === "off") return null;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, tier === "high" ? 1.5 : 1]}
      camera={{ position: [0, 1.1, 5.4], fov: 45 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#141311"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#ffe9c0" />
      <Ring count={tier === "low" ? 4 : 6} />
      {tier === "high" && (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom intensity={0.5} luminanceThreshold={0.6} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
