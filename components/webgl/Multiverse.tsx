"use client";

import { useMemo } from "react";
import { buildScreenLayout } from "@/lib/webgl-content";
import Screen from "./Screen";
import HeroReel from "./HeroReel";
import CameraRig from "./CameraRig";
import ParticleField from "./ParticleField";
import type { Tier } from "@/lib/webgl-capability";

export default function Multiverse({ tier }: { tier: Tier }) {
  const screens = useMemo(() => {
    const all = buildScreenLayout({ seed: 11 });
    return tier === "low" ? all.filter((_, i) => i % 2 === 0) : all;
  }, [tier]);

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer");

  return (
    <>
      <color attach="background" args={["#0c0b0a"]} />
      <fog attach="fog" args={["#0c0b0a", 30, 220]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#ffe9c0" />
      <CameraRig />
      <HeroReel />
      <ParticleField count={tier === "low" ? 600 : 1500} />
      {screens.map((s) => (
        <Screen key={s.id} datum={s} onOpen={open} />
      ))}
    </>
  );
}
