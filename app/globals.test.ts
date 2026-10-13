import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

describe("colour tokens", () => {
  it("sets the v4 palette", () => {
    expect(css).toMatch(/--color-paper:\s*#f4f0ea/i);
    expect(css).toMatch(/--color-ink:\s*#15171a/i);
    expect(css).toMatch(/--color-signal:\s*#ff2d20/i);
    expect(css).toMatch(/--color-signal-band:\s*#ff2d20/i);
    expect(css).toMatch(/--color-ink-faint:\s*rgba\(21,\s*23,\s*26,\s*0\.65\)/);
  });

  it("has no tints and no blue left", () => {
    expect(css).not.toMatch(/--color-(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/scene--(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/#1f3dff|#5c74ff/i);
    expect(css).not.toMatch(/\.redblock/);
  });

  it("styles the band through the inverted tokens, and the red block on top", () => {
    expect(css).toMatch(/\.band\s*\{[^}]*background:\s*var\(--color-ink\)/);
    expect(css).toMatch(/\.band \.poster-script[^{]*\{[^}]*color:\s*var\(--color-signal-band\)/);
    expect(css).toMatch(/\.band--signal\s*\{[^}]*background:\s*var\(--color-signal\)/);
  });
});
