// lib/content/founder-media.ts — server-only. The client supplies
// `public/assets/founder/parth.jpg` (and optionally `parth.mp4`); until
// then the founder sections render a labelled slot. Resolved at build
// time, so a missing file is a slot, never a 404. Not exported from the
// content barrel: it reads the disk, and the barrel reaches client bundles.
import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "assets", "founder");

export const founderMedia: { image: string; video?: string } | null = existsSync(join(dir, "parth.jpg"))
  ? { image: "/assets/founder/parth.jpg", ...(existsSync(join(dir, "parth.mp4")) ? { video: "/assets/founder/parth.mp4" } : {}) }
  : null;
