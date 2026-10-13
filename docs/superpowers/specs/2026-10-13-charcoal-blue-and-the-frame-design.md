# Charcoal, one blue, and "the frame": colour system v4 and the hero

Date: 2026-10-13. Status: approved in conversation; implementation plan to follow.

## Why

The October 2026 brief asks for a light, premium site with black/charcoal, off-white and
light grey as the base, exactly one accent (electric blue preferred), no mix of yellow,
blue and other accents, and a hero that shows the work. The current v3 "Poster" system
runs warm paper, a red accent and four pastel scene tints, and the hero is type-first
with the reel as a small sticker. A study of twelve agency and studio sites
(`claude.ai/code/artifact/d79cefd2-8c92-4558-b162-229b7bf7cbde`) found that the
reference sites keep the chrome to a neutral pair, use one accent in fewer than five
places, and let footage and work frames carry every saturated colour. The approved
direction is "A": charcoal, cool near-white, one electric blue; the approved hero is
"1 · The frame": the showreel filling the viewport with the headline over it.

## 1. Colour system

Seven tokens, as before. Values change; roles do not.

| Token | Value | Role |
|---|---|---|
| `--color-paper` | `#F5F6F7` | Ground. Cool near-white (a hair of blue), never pure white. |
| `--color-ink` | `#15171A` | Type, and the ground of the dark bands. |
| `--color-ink-dim` | `rgba(21,23,26,0.72)` | Body prose. |
| `--color-ink-faint` | `rgba(21,23,26,0.65)` | Labels, numerals. Measured 5.4:1 on paper; 0.55 would be 3.9:1 and fail. |
| `--color-hairline` | `rgba(21,23,26,0.14)` | 1px rules. |
| `--color-paper-deep` | `#E8EAED` | Media placeholder under thumbnails. |
| `--color-signal` | `#1F3DFF` | The accent, on paper. Token name stays `signal` so no class or component renames. |
| `--color-signal-band` | `#5C74FF` | The same blue, two steps lighter, for the script on the dark band. `#1F3DFF` on charcoal is 2.7:1 and fails even as large text; this is 4.6:1. The way a dark mode lifts its accent, not a second colour. |

Deleted: `--color-sun`, `--color-mint`, `--color-sky`, `--color-rose`, every
`.scene--sun/mint/sky/rose` rule, and the tint overrides for scripts and `.num`.

On the dark band (ink ground) the type tokens invert: paper, paper at 0.72 (9.0:1),
paper at 0.60 (6.6:1), paper at 0.16 for hairlines; the script and the hover fill use
`--color-signal-band`. These are the `.redblock` rules today, renamed `.band` and
extended; `.redblock` is removed.

Where the accent may appear (unchanged list, new colour):
1. the script word over a poster headline;
2. the bands' script and the bands' hairline-button hover;
3. the loader's "Media";
4. focus ring, scroll cue, current-page marker, selection.

Forbidden as before: accent words in running copy, accent buttons, accent rules,
glows, gradients.

Contrast, measured: accent on paper 6.1:1; ink on paper 16:1; paper on ink 15:1;
band accent on ink 4.6:1. The script keeps the 24px floor the CSS already enforces
(`font-size: max(1.5rem, 0.62em)`). The audit (`scripts/audit.mjs`) remains the gate.

### Scenes

`Scene`'s `tone` prop narrows to `"paper" | "dark"`. `dark` renders the ink ground as a
`.scene-ground` layer so `Depth.tsx` still draws it in on scroll (motion #12).

| Scene | Was | Now |
|---|---|---|
| Belief (Positioning) | sun | paper, with the BTS loop beside the statement |
| Numbers (Record) | mint | dark, with a faint wall of work frames behind the figures |
| Process | sky | dark, each stacked card carrying a frame |
| Testimonials | rose | dark; the deck's paper cards sit on charcoal |
| Training (home and page) | sun | paper, with the rendered playbook cover |
| About, the question | sky | dark |
| Contact band, About statement, footer | signal (red) | dark |

### The loader

Emblem strokes and fill in ink on paper; the letters in ink; "Media" in the accent.
Timeline, lock, flight and skip are untouched.

## 2. The hero: "the frame"

### Layout

- A full-viewport `<video>` behind everything, muted, looping, `playsInline`, poster
  frame as the first paint. It starts on the loader handoff as today
  (`whenIntroDone`), gated by an IntersectionObserver.
- A flat ink scrim at 0.5 over the footage, plus the darker encode, so paper type
  clears 4.5:1 over the brightest frame. Paper on pure white behind a 0.5 scrim is
  3.2:1, so the encode must do the rest: the build measures the mean luminance of the
  poster frame under the headline box and fails if paper on it is under 4.5:1.
- Headline, bottom-left, `poster--xl`, four lines as today, in paper, the accent script
  "kingmakers" on line two. SplitText rise on handoff with the `--wdth` condense.
- Under the headline, two small paper links: "Start a Project" (`/contact`) and "See Our
  Work →" (`/work`). Under those, the credibility strip as a static line of four items
  separated by dots; the `Ticker` marquee is removed from under the hero. (`Ticker`
  stays for the capabilities band.)
- Bottom-right, one round 72px Watch button, paper hairline, that calls `openReel`.
  It is the only control over the footage.
- The cursor trail (`ImageTrail`) stays, layered above the footage and below the type.
- The tilted sticker, the `.hero-tag` script and the "showreel ▶" tag are removed.

### Motion

- Handoff: the panel wipes to reveal the footage already moving; letters rise; the
  strip and links fade in after the letters; the Watch button scales in last.
- Scroll, first viewport (`--hero-open`), scrubbed: the footage frame shrinks from
  full-bleed to a card at the right (`inset(0)` → `inset(12% 4% 12% 52%)`), the
  scrim lifts to 0, the copy slides up and fades in the first fifth, and the paper
  page rises under it. This is the current takeover reversed. The sticky track and
  the curtain (`--hero-curtain`) are kept exactly, so the belief scene still rides
  over the hero's tail.
- Phone (`max-width: 767px`): footage full, headline at three lines
  (`["We build content systems", "that make brands", "impossible to ignore."]` at
  the phone size), strip wraps to two rows, Watch button above the strip.
- Reduced motion: poster frame only, no video, no scrub, no track; the hero is one
  still viewport.

### Assets

- `public/assets/webgl/hero-loop.mp4` and `hero-loop-720.mp4` are replaced by a 7s
  cut of the showreel's strongest shots (candidate in-points at 0.5, 2.2, 10.5, 16,
  20 and 24 s), encoded with a slight lift of black and -15 saturation so type sits on
  it, 1080p at ~4 Mbps and 720p at ~2 Mbps, 30 fps, faststart, no audio. The poster
  frame is the first frame of the cut at 1080p.

## 3. Media for the text-only sections

| Section | Media | Source |
|---|---|---|
| Belief | silent loop, showreel 9–14 s, 720p, beside the statement in the right column | cut from the reel |
| Founder story | portrait or ≤5 s loop, right column of the story | `public/assets/founder/parth.{jpg,mp4}` supplied by the client; if absent at build time the column renders a labelled paper slot, never a stock image |
| Founder's Corner | the same asset, beside the quote | same |
| Numbers | a 6×3 wall of work frames at 0.18 opacity behind the figures, non-interactive | `featured` + `rest` thumbs |
| Who we work with | one frame per audience card (a founder on camera, a creator Short, a brand film), picked by id in content | work thumbs |
| The offer | Day 01 Shoot: the BTS loop; Day 02 Analysis: type only | cut from the reel |
| Capabilities | a thumbnail between every third word in the band | work thumbs |
| Process | one frame per card, from the discipline it resembles | work thumbs |
| Training | a playbook cover rendered in CSS in the site's type (title, "30 days", the emblem) | none |

Every video is muted, looping, `preload="none"` until in view, with a poster. Every
image goes through `next/image` with `sizes`.

## 4. Files

- `app/globals.css`: tokens; delete tint rules; `.redblock` → `.band`; hero rules
  rewritten; wall, cover and media-column rules added.
- `DESIGN.md`: §1 Colour rewritten; §3 scene tones; §5 hero motion rows; pages table.
- `components/layout/Scene.tsx`: `tone: "paper" | "dark"`.
- `components/intro/Intro.tsx` + CSS: colour only.
- `components/home/Hero.tsx`: rewritten per §2. `components/home/Ticker.tsx` usage
  removed from `app/page.tsx` under the hero.
- `components/home/{Positioning,FounderStory,Record,Clients,Offer,Capabilities,Process,Testimonials,Founder,Training,Contact}.tsx`, `components/Footer.tsx`,
  `app/about/page.tsx`, `app/training/page.tsx`: tone changes and media per §3.
  The roster block inside `Clients.tsx` is not touched; only the audience cards gain
  a frame.
- `lib/content/`: a `media.ts` that names the clips, the audience frames and the
  founder asset path; `proof.ts` unchanged.
- `public/assets/webgl/`: new loop cuts and poster; `public/assets/clips/bts.mp4`.
- Tests: `lib/content/media.test.ts` (every referenced asset exists on disk);
  a `globals.css` test that fails if `--color-sun|mint|sky|rose` or `#ff2d20` returns.

## 5. Verification

`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `PORT=3123 node
scripts/audit.mjs` (0 violations, 0 overflow at 320–3440), the loader-handoff probe
(no finished hero shows under the wipe; footage playing at handoff), screenshots of
the hero and every changed section at 1440 and 390, console clean. Lighthouse LCP on
the home page must not regress past the current build with the poster frame as the
first paint.

## Out of scope

The nav, the work pages, the discipline pages, the deck's own mechanics, the contact
and playbook APIs, and any copy change: all are as the brief set them.
