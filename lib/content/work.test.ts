import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy, publishedCaseStudies } from "./work";

describe("case studies", () => {
  it("looks a case study up by slug", () => {
    const first = caseStudies[0];
    expect(getCaseStudy(first.slug)).toBe(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCaseStudy("not-a-real-client")).toBeUndefined();
  });

  it("gives every case study a unique slug", () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("carries three to six flagships", () => {
    // The spec caps flagships: depth where it counts, breadth in the index.
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    expect(caseStudies.length).toBeLessThanOrEqual(6);
  });

  it("gives every case study the content a brand buyer needs", () => {
    for (const c of caseStudies) {
      expect(c.challenge.length, `${c.slug} challenge`).toBeGreaterThan(0);
      expect(c.approach.length, `${c.slug} approach`).toBeGreaterThan(0);
      expect(c.deliverables.length, `${c.slug} deliverables`).toBeGreaterThan(0);
      expect(c.metrics.length, `${c.slug} metrics`).toBeGreaterThan(0);
      expect(c.media.length, `${c.slug} media`).toBeGreaterThan(0);
    }
  });

  it("excludes draft case studies from the published set", () => {
    // The launch gate: placeholder copy must not reach production.
    for (const c of publishedCaseStudies) {
      expect(c.contentStatus, `${c.slug} is draft`).toBe("final");
    }
  });
});
