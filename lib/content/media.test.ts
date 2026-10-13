import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { audienceFrames, capabilityFrames, clips, numbersWall, processFrames } from "./media";
import { founderMedia } from "./founder-media";

const onDisk = (p: string) => existsSync(join(process.cwd(), "public", p));

describe("media", () => {
  it("points every clip and poster at a file on disk", () => {
    for (const c of Object.values(clips)) {
      expect(onDisk(c.src), c.src).toBe(true);
      expect(onDisk(c.poster), c.poster).toBe(true);
    }
  });

  it("points every frame at a file on disk", () => {
    for (const p of [...Object.values(audienceFrames), ...processFrames, ...capabilityFrames, ...numbersWall]) {
      expect(onDisk(p), p).toBe(true);
    }
  });

  it("sizes the fixed sets", () => {
    expect(processFrames).toHaveLength(4);
    expect(capabilityFrames).toHaveLength(5);
    expect(numbersWall).toHaveLength(18);
    expect(new Set(numbersWall).size).toBe(18);
  });

  it("treats the founder asset as optional, never as a stock stand-in", () => {
    if (founderMedia) {
      expect(founderMedia.image).toMatch(/^\/assets\/founder\//);
      expect(onDisk(founderMedia.image)).toBe(true);
    } else {
      expect(founderMedia).toBeNull();
    }
  });
});
