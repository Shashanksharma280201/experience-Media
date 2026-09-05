/** Opening the full showreel is a page-wide event so any link can trigger it. */
export const REEL_OPEN = "em:reel-open";

/** Carries whatever had focus, so the player can hand it back on close. */
export function openReel() {
  window.dispatchEvent(
    new CustomEvent<HTMLElement | null>(REEL_OPEN, {
      detail: document.activeElement as HTMLElement | null,
    })
  );
}
