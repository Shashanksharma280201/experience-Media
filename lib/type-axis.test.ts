import { describe, expect, it } from "vitest";
import { ARCHIVO_WDTH, widthAxis } from "./type-axis";

describe("widthAxis", () => {
  it("is fully expanded at rest", () => {
    expect(widthAxis(0)).toBe(125);
  });

  it("is compressed at the end of the hero", () => {
    expect(widthAxis(1)).toBe(75);
  });

  it("compresses monotonically across the range", () => {
    const samples = [0, 0.25, 0.5, 0.75, 1].map(widthAxis);
    const sorted = [...samples].sort((a, b) => b - a);
    expect(samples).toEqual(sorted);
  });

  it("clamps progress outside 0..1", () => {
    expect(widthAxis(-3)).toBe(widthAxis(0));
    expect(widthAxis(9)).toBe(widthAxis(1));
  });

  it("never leaves the axis range the font actually supports", () => {
    // Out-of-range variation settings render unpredictably across browsers.
    for (let p = -1; p <= 2; p += 0.05) {
      const v = widthAxis(p);
      expect(v).toBeGreaterThanOrEqual(ARCHIVO_WDTH.min);
      expect(v).toBeLessThanOrEqual(ARCHIVO_WDTH.max);
    }
  });
});
