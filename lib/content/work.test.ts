import { describe, expect, it } from "vitest";
import { disciplines, getDiscipline, adjacentDisciplines } from "./work";

describe("disciplines", () => {
  it("looks a discipline up by slug", () => {
    const first = disciplines[0];
    expect(getDiscipline(first.slug)).toBe(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getDiscipline("interpretive-dance")).toBeUndefined();
  });

  it("gives every discipline a unique slug", () => {
    const slugs = disciplines.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every discipline real pieces and real prose", () => {
    for (const d of disciplines) {
      expect(d.items.length, `${d.slug} items`).toBeGreaterThan(0);
      expect(d.blurb.length, `${d.slug} blurb`).toBeGreaterThan(0);
      expect(d.context.length, `${d.slug} context`).toBeGreaterThan(0);
      expect(d.approach.length, `${d.slug} approach`).toBeGreaterThan(0);
    }
  });

  it("points every piece at a real outbound link", () => {
    for (const d of disciplines) {
      for (const item of d.items) {
        expect(item.href, `${d.slug} href`).toMatch(/^https:\/\//);
        expect(item.thumb, `${d.slug} thumb`).toMatch(/^\/assets\//);
      }
    }
  });
});

describe("adjacentDisciplines", () => {
  it("wraps around at both ends so navigation is never a dead end", () => {
    const first = disciplines[0].slug;
    const last = disciplines[disciplines.length - 1].slug;

    expect(adjacentDisciplines(first).prev.slug).toBe(last);
    expect(adjacentDisciplines(last).next.slug).toBe(first);
  });

  it("returns the true neighbours in the middle", () => {
    const { prev, next } = adjacentDisciplines(disciplines[1].slug);
    expect(prev.slug).toBe(disciplines[0].slug);
    expect(next.slug).toBe(disciplines[2].slug);
  });
});
