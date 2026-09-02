const FPS = 24;

/** Nominal runtime of the page-as-reel, in seconds. Purely presentational. */
const REEL_RUNTIME = 7 * 60;

const pad = (n: number) => String(n).padStart(2, "0");

/** Formats seconds as broadcast timecode: HH:MM:SS:FF. */
export function formatTimecode(seconds: number, fps = FPS): string {
  const t = Math.max(0, seconds);
  const whole = Math.floor(t);
  const frames = Math.min(fps - 1, Math.floor((t - whole) * fps));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

/** The scrubber's live readout — the only timecode that ticks with scroll. */
export function runtimeTimecode(progress: number): string {
  const p = Math.min(1, Math.max(0, progress));
  return formatTimecode(p * REEL_RUNTIME);
}

/**
 * A section's marker on the reel — deterministic from its index, not live.
 * Only the scrubber's readout ticks with scroll.
 */
export function sectionTimecode(index: number, total: number): string {
  if (total <= 0) return formatTimecode(0);
  return formatTimecode((index / total) * REEL_RUNTIME);
}
