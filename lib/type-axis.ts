/** Archivo's variable width axis, as exposed by next/font/google. */
export const ARCHIVO_WDTH = { min: 62, max: 125 } as const;

const REST = 125; // fully expanded at the top of the hero
const END = 75; // compressed once the hero has been scrolled through

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Maps hero scroll progress (0..1) to Archivo's `wdth` axis.
 * Width is the only animated property, so this can never reflow the line box.
 */
export function widthAxis(progress: number): number {
  return REST + (END - REST) * clamp01(progress);
}
