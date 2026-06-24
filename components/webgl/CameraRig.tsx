"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { sampleCameraPath } from "@/lib/camera-path";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Drives the camera along the path based on how far the #hero-scroll region
 *  has been scrolled (0 at its top, 1 when its bottom reaches the viewport). */
export default function CameraRig() {
  const { camera } = useThree();
  const lookAt = useRef(new Vector3());

  useFrame((_, delta) => {
    let p = 0;
    const el = document.getElementById("hero-scroll");
    if (el) {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      p = total > 0 ? clamp01(-rect.top / total) : 0;
    }
    const { position, lookAt: target } = sampleCameraPath(p);
    // Frame-rate-independent smoothing so motion feels consistent.
    const s = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(position, s);
    lookAt.current.lerp(target, s);
    camera.lookAt(lookAt.current);
  });

  return null;
}
