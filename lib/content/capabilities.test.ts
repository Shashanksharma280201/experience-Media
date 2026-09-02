import { describe, expect, it } from "vitest";
import { offers, services } from "./capabilities";

describe("capability offers", () => {
  it("groups the services into exactly four offers", () => {
    expect(offers).toHaveLength(4);
  });

  it("places every service in exactly one offer", () => {
    const grouped = offers.flatMap((o) => o.services.map((s) => s.title));
    const expected = services.map((s) => s.title);

    expect([...grouped].sort()).toEqual([...expected].sort());
  });

  it("gives every offer at least one service", () => {
    for (const offer of offers) {
      expect(offer.services.length).toBeGreaterThan(0);
    }
  });

  it("gives every offer a unique id", () => {
    const ids = offers.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps VFX and CGI isolated as the Post & VFX offer", () => {
    // This offer is what the WebGL proof moment demonstrates; merging it would
    // bury the one capability the site can prove in-browser rather than assert.
    const post = offers.find((o) => o.id === "post-vfx");
    expect(post?.services.map((s) => s.title)).toEqual(["VFX And CGI"]);
  });
});
