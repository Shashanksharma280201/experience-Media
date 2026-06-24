import { CatmullRomCurve3, Vector3 } from "three";

// Camera travels LESS deep than the screen field (depth ~150) so it always has
// artwork ahead — it never outruns the gallery into empty space.
const curve = new CatmullRomCurve3(
  [
    new Vector3(0, 0, 12),
    new Vector3(-1.5, 1, -22),
    new Vector3(2, -1, -55),
    new Vector3(-1.5, 0.6, -90),
    new Vector3(1, 0, -120),
  ],
  false,
  "catmullrom",
  0.5
);

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
