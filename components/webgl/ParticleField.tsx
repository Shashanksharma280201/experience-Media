"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";
import type { Points as TPoints } from "three";

export default function ParticleField({ count = 1500 }) {
  const ref = useRef<TPoints>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(count * 3), { radius: 120 }) as Float32Array,
    [count]
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.01;
    ref.current.rotation.x += dt * 0.004;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c8920a"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}
