"use client";

import { useMemo, type RefObject } from "react";
import { buildScreenLayout } from "@/lib/webgl-content";
import Screen from "./Screen";
import CameraRig, { type CameraMode } from "./CameraRig";
import ParticleField from "./ParticleField";
import type { Tier } from "@/lib/webgl-capability";

export default function Multiverse({
  tier,
  progressRef,
  mode,
}: {
  tier: Tier;
  progressRef: RefObject<number>;
  mode: CameraMode;
}) {
  const screens = useMemo(() => {
    const all = buildScreenLayout({ seed: 11 });
    return tier === "low" ? all.filter((_, i) => i % 2 === 0) : all;
  }, [tier]);

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer");

  return (
    <>
      <color attach="background" args={["#0b0a09"]} />
      {/* Distant fog — atmosphere without hiding the artwork. */}
      <fog attach="fog" args={["#0b0a09", 90, 360]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#ffe9c0" />
      <CameraRig progressRef={progressRef} mode={mode} />
      <ParticleField count={tier === "low" ? 350 : 800} />
      {screens.map((s) => (
        <Screen key={s.id} datum={s} onOpen={open} />
      ))}
    </>
  );
}
