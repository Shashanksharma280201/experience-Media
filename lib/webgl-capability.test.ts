import { describe, it, expect } from "vitest";
import { pickTier } from "@/lib/webgl-capability";

const base = {
  hasWebGL: true,
  reducedMotion: false,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
};

describe("pickTier", () => {
  it("off when no webgl", () => {
    expect(pickTier({ ...base, hasWebGL: false })).toBe("off");
  });
  it("off when reduced motion", () => {
    expect(pickTier({ ...base, reducedMotion: true })).toBe("off");
  });
  it("low on touch devices", () => {
    expect(pickTier({ ...base, coarsePointer: true })).toBe("low");
  });
  it("low on weak hardware", () => {
    expect(pickTier({ ...base, deviceMemory: 4 })).toBe("low");
    expect(pickTier({ ...base, hardwareConcurrency: 4 })).toBe("low");
  });
  it("high on capable desktop", () => {
    expect(pickTier(base)).toBe("high");
  });
});
