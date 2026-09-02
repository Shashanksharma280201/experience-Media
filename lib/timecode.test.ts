import { describe, expect, it } from "vitest";
import { formatTimecode, runtimeTimecode, sectionTimecode } from "./timecode";

describe("formatTimecode", () => {
  it("renders zero as a full timecode", () => {
    expect(formatTimecode(0)).toBe("00:00:00:00");
  });

  it("splits seconds into minutes and frames at 24fps", () => {
    expect(formatTimecode(61.5)).toBe("00:01:01:12");
  });

  it("carries into hours", () => {
    expect(formatTimecode(3661)).toBe("01:01:01:00");
  });

  it("never emits a frame count equal to the frame rate", () => {
    // 23.9999s is still frame 23 of second 23, not frame 24.
    expect(formatTimecode(23.9999)).toBe("00:00:23:23");
  });

  it("clamps negative input to zero", () => {
    expect(formatTimecode(-10)).toBe("00:00:00:00");
  });
});

describe("runtimeTimecode", () => {
  it("starts at zero", () => {
    expect(runtimeTimecode(0)).toBe("00:00:00:00");
  });

  it("reaches the full runtime at the end of the page", () => {
    expect(runtimeTimecode(1)).toBe("00:07:00:00");
  });

  it("clamps progress outside 0..1", () => {
    expect(runtimeTimecode(-1)).toBe(runtimeTimecode(0));
    expect(runtimeTimecode(4)).toBe(runtimeTimecode(1));
  });
});

describe("sectionTimecode", () => {
  it("starts the reel at zero", () => {
    expect(sectionTimecode(0, 7)).toBe("00:00:00:00");
  });

  it("spaces sections evenly and deterministically", () => {
    const a = sectionTimecode(3, 7);
    expect(sectionTimecode(3, 7)).toBe(a);
    expect(a).not.toBe(sectionTimecode(4, 7));
  });

  it("advances monotonically through the reel", () => {
    const marks = [0, 1, 2, 3, 4, 5, 6].map((i) => sectionTimecode(i, 7));
    expect([...marks].sort()).toEqual(marks);
  });
});
