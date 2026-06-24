import { mulberry32 } from "@/lib/prng";
import { portfolio } from "@/lib/content";

export type ScreenDatum = {
  id: string;
  href: string;
  thumb: string;
  platform: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  aspect: "landscape" | "portrait";
};

type Opts = { seed?: number; depth?: number; spread?: number };

/** Flatten portfolio into screens scattered through the void along -Z. */
export function buildScreenLayout(opts: Opts = {}): ScreenDatum[] {
  const { seed = 1, depth = 150, spread = 12 } = opts;
  const rand = mulberry32(seed);

  const items = portfolio.flatMap((cat) =>
    cat.items.map((it) => ({ ...it, layout: cat.layout }))
  );

  const near = 6; // keep nearest screens just behind the hero reel
  return items.map((it, i) => {
    const t = items.length > 1 ? i / (items.length - 1) : 0;
    const z = -near - t * (depth - near);
    const side = rand() > 0.5 ? 1 : -1;
    // Flank the flight path closely so screens stay large and readable.
    const x = side * (4 + rand() * spread);
    const y = (rand() - 0.5) * 12;
    const aspect: ScreenDatum["aspect"] =
      it.layout === "short" ? "portrait" : "landscape";
    return {
      id: `${it.href}-${i}`,
      href: it.href,
      thumb: it.thumb,
      platform: it.platform,
      position: [x, y, z],
      // Gentle, mostly front-facing tilt so artwork reads clearly.
      rotation: [
        (rand() - 0.5) * 0.12,
        -side * (0.05 + rand() * 0.14),
        (rand() - 0.5) * 0.05,
      ],
      scale: 5 + rand() * 3,
      aspect,
    };
  });
}
