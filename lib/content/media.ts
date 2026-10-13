// lib/content/media.ts — every clip and frame the home page places beside
// its copy, named in one place so a test can prove each file exists.
// Plain data only: this file is imported by client components through the
// content barrel, so it must never touch the filesystem.
// The work frames are picked by piece id so a reorder of the portfolio
// never changes what a section shows.
import { disciplines, featured, pieceId, rest } from "./work";

export type Clip = { src: string; poster: string };

export const clips = {
  hero: { src: "/assets/webgl/hero-loop.mp4", poster: "/assets/webgl/hero-poster.jpg" },
  heroSmall: { src: "/assets/webgl/hero-loop-720.mp4", poster: "/assets/webgl/hero-poster.jpg" },
  /** The reel's behind-the-scenes passage, 9–14 s. */
  bts: { src: "/assets/clips/bts.mp4", poster: "/assets/clips/bts-poster.jpg" },
} satisfies Record<string, Clip>;

const all = [...featured.map((f) => ({ id: pieceId(f.href), thumb: f.thumb })), ...rest.map((r) => ({ id: pieceId(r.href), thumb: r.thumb }))];
const byId = (id: string): string => {
  const hit = all.find((p) => p.id === id);
  if (!hit) throw new Error(`media: no piece ${id}`);
  return hit.thumb;
};
const firstOf = (slug: string): string => {
  const d = disciplines.find((x) => x.slug === slug);
  if (!d) throw new Error(`media: no discipline ${slug}`);
  return d.items[0].thumb;
};

/** One frame per audience: a founder on camera, a creator's Short, a brand film. */
export const audienceFrames = {
  "business-owners": byId("8nES01011GY"),
  "content-creators": byId("oK1jMtrgQU4"),
  brands: byId("4mX9fkeQFHQ"),
} as const;

/** One per process step: discover (podcast), strategise (long-form), produce (VFX), grow (short-form). */
export const processFrames = [firstOf("podcast"), firstOf("long-form"), firstOf("vfx-cgi"), firstOf("short-format")];

/** Cycled between the words of the capabilities band. */
export const capabilityFrames = [byId("4mX9fkeQFHQ"), byId("xIncgA51Sks"), byId("gzb4m1xQEiQ"), byId("6pPNOvofdWs"), byId("-DBx9Ss1C-g")];

/** The faint wall behind the numbers: 6×3, landscape pieces first. */
export const numbersWall = [...featured.filter((f) => f.orientation === "landscape"), ...rest.filter((r) => r.discipline.layout === "long")]
  .map((p) => p.thumb)
  .filter((t, i, a) => a.indexOf(t) === i)
  .slice(0, 18);
