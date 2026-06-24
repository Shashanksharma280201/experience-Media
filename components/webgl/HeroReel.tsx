"use client";

import { useEffect, useMemo } from "react";
import { VideoTexture, SRGBColorSpace } from "three";

export default function HeroReel({
  src = "/assets/webgl/hero-loop.mp4",
  position = [0, 0, 2] as [number, number, number],
  active = true,
}) {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = src;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    return v;
  }, [src]);

  const texture = useMemo(() => {
    const t = new VideoTexture(video);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [video]);

  // Play only when the hero is visible and the tab is foregrounded.
  useEffect(() => {
    const shouldPlay = () => active && !document.hidden;
    const sync = () =>
      shouldPlay() ? video.play().catch(() => {}) : video.pause();
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [video, active]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[12, 6.75]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
