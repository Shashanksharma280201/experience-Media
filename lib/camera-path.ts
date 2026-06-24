import { CatmullRomCurve3, Vector3 } from "three";

const DEPTH = 220;

// A gently weaving path flying from the front of the void toward the back.
const curve = new CatmullRomCurve3([
  new Vector3(0, 0, 12),
  new Vector3(-4, 2, -30),
  new Vector3(5, -2, -80),
  new Vector3(-3, 1, -140),
  new Vector3(2, 0, -DEPTH),
]);

export type CameraSample = { position: Vector3; lookAt: Vector3 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function sampleCameraPath(progress: number): CameraSample {
  const t = clamp01(progress);
  const position = curve.getPointAt(t);
  const lookAt = curve.getPointAt(clamp01(t + 0.04));
  // Ensure lookAt is always ahead even at t=1.
  if (lookAt.z >= position.z) lookAt.z = position.z - 8;
  return { position, lookAt };
}
