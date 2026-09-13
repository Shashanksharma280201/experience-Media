import { describe, expect, it } from "vitest";
import { brands, creatorPortraits, creators } from "./clients";

describe("the roster", () => {
  it("gives every brand a name, since the name is what the roster sets", () => {
    for (const b of brands) {
      expect(b.name.trim().length, `${b.img} name`).toBeGreaterThan(0);
    }
  });

  it("keeps brand names unique — the roster keys and renders on them", () => {
    const names = brands.map((b) => b.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every brand intrinsic dimensions, so no logo shifts the layout", () => {
    for (const b of brands) {
      expect(b.w, `${b.name} width`).toBeGreaterThan(0);
      expect(b.h, `${b.name} height`).toBeGreaterThan(0);
    }
  });

  it("points every logo at an asset in the brand folder", () => {
    for (const b of brands) {
      expect(b.img, `${b.name} img`).toMatch(/^\/assets\/brands\/.+\.(png|jpe?g|webp|svg)$/);
    }
  });

  it("leaves most brands with a silhouette to show", () => {
    // A brand flagged for artwork is set in type instead. If that ever became
    // the common case the frame would be all type and no evidence.
    const set = brands.filter((b) => b.needsTransparentAsset);
    expect(set.length).toBeLessThan(brands.length / 2);
  });
});

describe("creator portraits", () => {
  it("gives every creator exactly one round crop", () => {
    expect(creatorPortraits).toHaveLength(creators.length);
  });

  it("resolves each one into the round folder", () => {
    for (const src of creatorPortraits) {
      expect(src).toMatch(/^\/assets\/creators\/round\/.+\.png$/);
    }
  });

  it("does not collide two creators onto one crop", () => {
    expect(new Set(creatorPortraits).size).toBe(creatorPortraits.length);
  });
});
