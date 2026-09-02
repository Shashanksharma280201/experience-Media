export type Tier = "off" | "low" | "high";

export function pickTier(input: {
  hasWebGL: boolean;
  reducedMotion: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  coarsePointer: boolean;
}): Tier {
  if (!input.hasWebGL || input.reducedMotion) return "off";
  const lowMem = (input.deviceMemory ?? 8) <= 4;
  const lowCpu = (input.hardwareConcurrency ?? 8) <= 4;
  if (input.coarsePointer || lowMem || lowCpu) return "low";
  return "high";
}

// --- useSyncExternalStore adapter -------------------------------------------
// The tier never changes for a session, so the snapshot is computed once and
// cached. This lets components read it without setState-inside-an-effect.

let cached: Tier | null = null;
const noop = () => {};

export const subscribeTier = () => noop;

export function getTierSnapshot(): Tier {
  if (cached === null) cached = detectTier();
  return cached;
}

/** Server render assumes no WebGL; the client swaps in the real tier. */
export const getServerTierSnapshot = (): Tier => "off";

/** Runtime probe — only call in the browser. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  let hasWebGL = false;
  try {
    const c = document.createElement("canvas");
    hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    hasWebGL = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return pickTier({
    hasWebGL,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  });
}
