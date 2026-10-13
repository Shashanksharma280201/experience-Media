import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

describe("colour tokens", () => {
  it("sets the v4 palette", () => {
    expect(css).toMatch(/--color-paper:\s*#f5f6f7/i);
    expect(css).toMatch(/--color-ink:\s*#15171a/i);
    expect(css).toMatch(/--color-signal:\s*#1f3dff/i);
    expect(css).toMatch(/--color-signal-band:\s*#5c74ff/i);
    expect(css).toMatch(/--color-ink-faint:\s*rgba\(21,\s*23,\s*26,\s*0\.65\)/);
  });

  it("has no tints and no red left", () => {
    expect(css).not.toMatch(/--color-(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/scene--(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/#ff2d20/i);
    expect(css).not.toMatch(/\.redblock/);
  });

  it("styles the band through the inverted tokens", () => {
    expect(css).toMatch(/\.band\s*\{[^}]*background:\s*var\(--color-ink\)/);
    expect(css).toMatch(/\.band \.poster-script[^{]*\{[^}]*color:\s*var\(--color-signal-band\)/);
  });
});
