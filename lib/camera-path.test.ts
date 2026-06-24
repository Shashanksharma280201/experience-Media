import { describe, it, expect } from "vitest";
import { sampleCameraPath } from "@/lib/camera-path";

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
