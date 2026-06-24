"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { MathUtils, type Mesh } from "three";
import type { ScreenDatum } from "@/lib/webgl-content";

export default function Screen({
  datum,
  onOpen,
}: {
  datum: ScreenDatum;
  onOpen: (href: string) => void;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const w = datum.aspect === "landscape" ? datum.scale * 1.6 : datum.scale * 0.9;
  const h = datum.aspect === "landscape" ? datum.scale * 0.9 : datum.scale * 1.6;

  useFrame(() => {
    if (!ref.current) return;
    const target = hovered ? 1.08 : 1;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, w * target, 0.12);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, h * target, 0.12);
  });

  return (
    <group position={datum.position} rotation={datum.rotation}>
      <Image
        ref={ref}
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
