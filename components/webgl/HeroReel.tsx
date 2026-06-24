"use client";

import { useEffect, useMemo } from "react";
import { VideoTexture, SRGBColorSpace } from "three";

export default function HeroReel({
  src = "/assets/experience-media-show-reel.mp4",
  position = [0, 0, 2] as [number, number, number],
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

  useEffect(() => {
    video.play().catch(() => {});
    const onVis = () =>
      document.hidden ? video.pause() : video.play().catch(() => {});
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      video.pause();
      texture.dispose();
    };
  }, [video, texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[12, 6.75]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
