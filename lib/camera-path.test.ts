import { describe, it, expect } from "vitest";
import { sampleCameraPath, samplePullback } from "@/lib/camera-path";

describe("sampleCameraPath", () => {
  it("clamps progress below 0 and above 1", () => {
    expect(sampleCameraPath(-1).position.z).toBeCloseTo(sampleCameraPath(0).position.z, 5);
    expect(sampleCameraPath(2).position.z).toBeCloseTo(sampleCameraPath(1).position.z, 5);
  });
  it("moves the camera forward (more negative Z) as progress increases", () => {
    expect(sampleCameraPath(1).position.z).toBeLessThan(sampleCameraPath(0).position.z);
  });
  it("lookAt is ahead of the camera (more negative Z than position)", () => {
    const s = sampleCameraPath(0.5);
    expect(s.lookAt.z).toBeLessThan(s.position.z);
  });
});

describe("samplePullback", () => {
  it("retreats as progress increases, revealing the constellation", () => {
    expect(samplePullback(1).position.z).toBeGreaterThan(samplePullback(0).position.z);
  });

  it("retreats monotonically", () => {
    const zs = [0, 0.25, 0.5, 0.75, 1].map((p) => samplePullback(p).position.z);
    expect([...zs].sort((a, b) => a - b)).toEqual(zs);
  });

  it("keeps looking into the field, never behind the camera", () => {
    for (const p of [0, 0.5, 1]) {
      const s = samplePullback(p);
      expect(s.lookAt.z).toBeLessThan(s.position.z);
    }
  });

  it("clamps progress outside 0..1", () => {
    expect(samplePullback(-2).position.z).toBeCloseTo(samplePullback(0).position.z, 5);
    expect(samplePullback(5).position.z).toBeCloseTo(samplePullback(1).position.z, 5);
  });
});
