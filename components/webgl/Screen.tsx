"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { MathUtils, type Group, type Mesh } from "three";
import type { ScreenDatum } from "@/lib/webgl-content";

export default function Screen({
  datum,
  onOpen,
}: {
  datum: ScreenDatum;
  onOpen: (href: string) => void;
}) {
  const group = useRef<Group>(null);
  const img = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const w = datum.aspect === "landscape" ? datum.scale * 1.6 : datum.scale * 0.9;
  const h = datum.aspect === "landscape" ? datum.scale * 0.9 : datum.scale * 1.6;

  // Per-screen drift parameters (deterministic from position, no flicker).
  const drift = useMemo(() => {
    const [px, py, pz] = datum.position;
    const phase = (px * 0.7 + py * 1.3 + pz * 0.2) % (Math.PI * 2);
    return {
      phase,
      ax: 0.5 + ((Math.abs(px) % 5) / 5) * 0.5, // x amplitude
      ay: 0.4 + ((Math.abs(py) % 4) / 4) * 0.5, // y amplitude
      sx: 0.18 + (Math.abs(px) % 3) * 0.04, // x speed
      sy: 0.14 + (Math.abs(py) % 3) * 0.04, // y speed
    };
  }, [datum.position]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // Smooth continuous float around the base position/rotation.
      group.current.position.x =
        datum.position[0] + Math.sin(t * drift.sx + drift.phase) * drift.ax;
      group.current.position.y =
        datum.position[1] + Math.cos(t * drift.sy + drift.phase) * drift.ay;
      group.current.rotation.z =
        datum.rotation[2] + Math.sin(t * 0.15 + drift.phase) * 0.03;
    }
    if (img.current) {
      const target = hovered ? 1.1 : 1;
      img.current.scale.x = MathUtils.lerp(img.current.scale.x, w * target, 0.12);
      img.current.scale.y = MathUtils.lerp(img.current.scale.y, h * target, 0.12);
    }
  });

  return (
    <group
      ref={group}
      position={datum.position}
      rotation={[datum.rotation[0], datum.rotation[1], datum.rotation[2]]}
    >
      <Image
        ref={img}
        url={datum.thumb}
        scale={[w, h]}
        transparent
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(datum.href);
        }}
      />
    </group>
  );
}
