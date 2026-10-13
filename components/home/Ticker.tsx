import { Fragment } from "react";
import Image from "next/image";
import ScrollVelocity from "@/components/bits/ScrollVelocity";

/**
 * A band of short phrases that slides with your scroll and reverses when
 * you do (React Bits ScrollVelocity). With `frames`, a work frame sits
 * between every third word, so the band shows what it names.
 */
export default function Ticker({ items, label, frames = [], className = "" }: { items: string[]; label: string; frames?: string[]; className?: string }) {
  // Two rows, each its own keyed element: the same element twice in an
  // array is what React warns about.
  const rows = ["a", "b"].map((id) => (
    <Fragment key={`row-${id}`}>
      {items.map((n, i) => (
        <Fragment key={n}>
          <span className="ticker-item">
            {n}
            <span aria-hidden className="ticker-dot" />
          </span>
          {frames.length > 0 && i % 3 === 2 && (
            <span className="ticker-frame" aria-hidden>
              <Image src={frames[Math.floor(i / 3) % frames.length]} alt="" fill sizes="12vw" loading="lazy" className="object-cover" />
            </span>
          )}
        </Fragment>
      ))}
    </Fragment>
  ));
  return (
    <div className={`ticker ${className}`} aria-label={`${label}: ${items.join(", ")}`}>
      <ScrollVelocity texts={rows} velocity={60} numCopies={4} className="ticker-copy" scrollerClassName="ticker-row" />
    </div>
  );
}
