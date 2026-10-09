import { describe, expect, it } from "vitest";
import { credibility, metrics, process } from "./proof";

describe("the approved numbers", () => {
  it("lead with the five the brief approves, in its order", () => {
    expect(metrics.map((m) => m.value)).toEqual(["500M+", "30M+", "10", "15+", "9+"]);
  });

  it("never publish the retired 300M+ claim", () => {
    const all = [...metrics.map((m) => m.value), ...credibility].join(" ");
    expect(all).not.toContain("300M");
  });

  it("run the process in four moves", () => {
    expect(process.map((p) => p.title)).toEqual(["Discover", "Strategise", "Produce", "Grow"]);
  });
});
