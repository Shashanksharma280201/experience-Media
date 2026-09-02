import Image from "next/image";
import { brands, type Brand } from "@/lib/content";

/**
 * Logos are optically balanced by proportion, not by a single bounding box:
 * a 7:1 wordmark and a 1:1 mark need different caps to read at the same weight.
 */
function cap(b: Brand): string {
  const ratio = b.w / b.h;
  if (ratio >= 3) return "max-h-[26px] max-w-[152px]"; // wordmark
  if (ratio >= 1.6) return "max-h-[38px] max-w-[124px]"; // wide lockup
  return "max-h-[46px] max-w-[92px]"; // square mark
}

/**
 * Motion #6 — a continuous linear marquee, paused on hover.
 * Greyscale, no borders, no cards.
 */
export default function LogoBand() {
  const usable = brands.filter((b) => !b.needsTransparentAsset);
  // Two identical halves make the -50% loop seamless.
  const track = [...usable, ...usable];

  return (
    <section aria-labelledby="clients-label" className="overflow-hidden py-14 md:py-20">
      <h2 id="clients-label" className="sr-only">
        Clients we have worked with
      </h2>

      <div className="marquee flex w-max items-center">
        {track.map((b, i) => {
          const isClone = i >= usable.length;
          return (
            <div
              key={`${b.name}-${i}`}
              className="flex h-[46px] w-[clamp(150px,15vw,210px)] shrink-0 items-center justify-center px-6"
              aria-hidden={isClone ? true : undefined}
            >
              <Image
                src={b.img}
                alt={isClone ? "" : b.name}
                width={b.w}
                height={b.h}
                loading="lazy"
                sizes="210px"
                className={`${cap(b)} w-auto object-contain opacity-60 brightness-0 invert transition-opacity duration-[var(--dur-quick)] hover:opacity-100`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
