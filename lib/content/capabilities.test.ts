import { describe, expect, it } from "vitest";
import { capabilities, legs, services } from "./capabilities";

describe("the three legs", () => {
  it("are exactly three, as the brief sets them", () => {
    expect(legs.map((l) => l.title)).toEqual(["Viral Social Media Content", "Podcast Production", "Event Coverage"]);
  });

  it("each carry an inquiry CTA and something to include", () => {
    for (const l of legs) {
      expect(l.cta.length, `${l.id} cta`).toBeGreaterThan(0);
      expect(l.includes.length, `${l.id} includes`).toBeGreaterThan(0);
    }
  });

  it("have unique ids", () => {
    const ids = legs.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("capabilities", () => {
  it("lists the fifteen layers, each once", () => {
    expect(capabilities).toHaveLength(15);
    expect(new Set(capabilities).size).toBe(15);
  });
});

describe("services", () => {
  it("still lists the nine services with an icon each", () => {
    expect(services).toHaveLength(9);
    for (const s of services) expect(s.img).toMatch(/^\/assets\/services\//);
  });
});
