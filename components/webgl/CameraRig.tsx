"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { sampleCameraPath, samplePullback } from "@/lib/camera-path";

export type CameraMode = "constellation" | "pullback";

/**
 * Drives the camera from a progress ref written outside the R3F tree.
 * A plain ref crosses the reconciler boundary that React context does not.
 */
export default function CameraRig({
  progressRef,
  mode,
}: {
  progressRef: RefObject<number>;
  mode: CameraMode;
}) {
  const { camera } = useThree();
  const lookAt = useRef(new Vector3());

  useFrame((_, delta) => {
    const p = progressRef.current;
    const sample = mode === "pullback" ? samplePullback(p) : sampleCameraPath(p);
    // Frame-rate-independent smoothing so motion feels the same at any fps.
    const s = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(sample.position, s);
    lookAt.current.lerp(sample.lookAt, s);
    camera.lookAt(lookAt.current);
  });

  return null;
}
