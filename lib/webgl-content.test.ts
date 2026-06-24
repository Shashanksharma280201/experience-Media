import { describe, it, expect } from "vitest";
import { buildScreenLayout } from "@/lib/webgl-content";

describe("buildScreenLayout", () => {
  it("creates one screen per portfolio item", () => {
    const layout = buildScreenLayout({ seed: 1 });
    expect(layout.length).toBeGreaterThan(20);
  });
  it("is deterministic for a seed", () => {
    expect(buildScreenLayout({ seed: 5 })).toEqual(buildScreenLayout({ seed: 5 }));
  });
  it("spreads screens along negative Z within depth", () => {
    const layout = buildScreenLayout({ seed: 2, depth: 200 });
    const zs = layout.map((s) => s.position[2]);
    expect(Math.min(...zs)).toBeGreaterThanOrEqual(-200);
    expect(Math.max(...zs)).toBeLessThanOrEqual(0);
  });
  it("assigns aspect from platform/layout and valid hrefs", () => {
    const layout = buildScreenLayout({ seed: 3 });
    for (const s of layout) {
      expect(s.href).toMatch(/^https?:\/\//);
      expect(["landscape", "portrait"]).toContain(s.aspect);
    }
  });
});
