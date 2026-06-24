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
  const { seed = 1, depth = 220, spread = 34 } = opts;
  const rand = mulberry32(seed);

  const items = portfolio.flatMap((cat) =>
    cat.items.map((it) => ({ ...it, layout: cat.layout }))
  );

  return items.map((it, i) => {
    const t = items.length > 1 ? i / (items.length - 1) : 0;
    const z = -t * depth;
    const side = rand() > 0.5 ? 1 : -1;
    const x = side * (6 + rand() * spread);
    const y = (rand() - 0.5) * 22;
    const aspect: ScreenDatum["aspect"] =
      it.layout === "short" ? "portrait" : "landscape";
    return {
      id: `${it.href}-${i}`,
      href: it.href,
      thumb: it.thumb,
      platform: it.platform,
      position: [x, y, z],
      rotation: [
        (rand() - 0.5) * 0.3,
        -side * (0.2 + rand() * 0.3),
        (rand() - 0.5) * 0.1,
      ],
      scale: 3 + rand() * 2.5,
      aspect,
    };
  });
}
