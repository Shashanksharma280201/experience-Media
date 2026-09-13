# Experience Media — Design System, v3 "Poster"

**Status:** implemented on `redesign/studio`, awaiting client review
**Spec:** `docs/superpowers/specs/2026-09-04-signal-redesign-design.md` (v2), with the v3 addendum at the end of that file
**Reference:** WarholArts (warhol-arts.webflow.io), translated to paper
**Stack:** Next 16 App Router · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis

Experience Media is a founder-led marketing agency in New Delhi. The site's job
is to make a brand's marketing lead feel, within one scroll, that this agency
knows how attention works and can prove it.

---

## 1. Colour

Warm paper, near-black ink, one red. Seven values.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4F0EA` | Ground. The only background colour on the site. |
| `--ink` | `#0A0A0B` | Type. |
| `--ink-dim` | `rgba(10,10,11,0.72)` | Body prose, secondary type. ~7.8:1 on paper. |
| `--ink-faint` | `rgba(10,10,11,0.6)` | Labels, numerals, metadata. ~5.0:1 — the floor for normal text. |
| `--hairline` | `rgba(10,10,11,0.14)` | 1px rules. The only border colour. |
| `--paper-deep` | `#E9E4DD` | Media placeholder, under thumbnails only. |
| `--signal` | `#FF2D20` | **The accent.** |
| `--sun` · `--mint` · `--sky` · `--rose` | `#F5C542` · `#8FD3B1` · `#9CC0F0` · `#F4A493` | Pop tints, saturated. Flat, one per scene: sun behind the belief, mint behind the record, sky behind the process, rose behind the voices. Ink on all of them; body prose clears 5.6:1 or better. No red clears 3:1 on them, so the script is ink there. |

The alpha ramp is set by measured contrast, not by eye; `npm run audit` checks
it on every route.

### Where the accent is allowed to appear

1. **The script** — one word in Pinyon Script laid across a poster headline. Never a whole sentence.
2. **The red blocks** — the contact band and the footer, full-bleed, with ink type.
3. **The loading screen's script** — the wordmark's "Media".
4. **Focus ring**, **scroll cue**, **current-page marker**, **selection**.

Forbidden: red words inside running copy, red buttons, red rules, glows,
gradients. The v2 signal line is retired: the red has a bigger job now.

### The mark

The emblem (`components/brand/Emblem.tsx`, traced from the original artwork)
appears in three places: beside the wordmark in the nav, above the wordmark in
the loader, and in the footer's red block. It inherits the text colour, so it
is ink on paper and on the tints, ink on the red.

### Deliberately not doing

No secondary accent. No greys beyond the three alpha steps of ink. Client
logos render flat black at 60%, full on hover.

---

## 2. Typography

### Families

| Role | Family | Licence | Hosting |
|---|---|---|---|
| Display | **Archivo** (variable: `wght`, `wdth` 62–125) | SIL OFL | Self-hosted via `next/font/google`, subset to latin |
| Text | **Inter Tight** (variable: `wght`) | SIL OFL | Same |

Archivo pushed wide at heavy weights gives the dense, squared display
personality; Inter Tight is narrow and quiet. They differ on the *width* axis,
which is what keeps them from reading as two versions of the same face, and
the width axis is the site's one live typographic effect (the reel headline).

### Tiers

| Tier | Size | Where |
|---|---|---|
| `poster--xl` | clamp(3.5rem, 12.5vw, 12.5rem), Archivo `wdth` 62 `wght` 800, caps, leading 0.86 | The hero headline only. |
| `poster--l` | clamp(3rem, 9.5vw, 9rem), same face | Every scene headline; page titles. |
| `poster--m` | clamp(2.25rem, 5.5vw, 5rem) | The belief statement, the figures, fold captions, prev/next. |
| `row-title.poster` | clamp(1.75rem, 4vw, 3.25rem) | Row titles in services, process, work index. |
| `display-m` | clamp(1.75rem, 3.6vw, 3rem), `wdth` 105 | Pull quotes. |
| `lede` · `small` · `micro` · `num` | as v2 | Prose; metadata; the parenthetical label; numerals. |

**The script.** Pinyon Script, red (paper on the red blocks, ink on the
tints), one word, rotated -6°, laid over the end of its line with its right
edge just past the last letter, so it never runs off a full-width line and
lands the same way at every width. Never below 24px, so it always clears 3:1
as large text. Decorative and hidden from assistive tech.

There are no eyebrow labels, numerals, or tracked-out caps outside the poster
headlines. `micro` survives only for captions inside media (the reel's
"showreel, 2024–25").

---

## 3. The scene

One act per section. A scene is at least a viewport tall, opens with the
numeral and the parenthetical label, and centres one thing: a poster headline
and what it introduces. `tight` scenes (lists) drop the viewport minimum.
`tone="signal"` makes the scene a red block.

---

## 4. Layout

### The grammar

```
POSTER HEADLINE            ← one word in red script laid across a line
the one thing
```

No numerals, no parenthetical labels: the headline is the label. The user
asked for both to go on 2026-09-05.

### The row

Services, process, work-index rows, and featured voices are all the same row:
a hairline, a title in poster caps in columns 1–5, and the body in columns
7–12.

### Measure and rhythm

Full width: the measure is the viewport less the gutters (20 / 32 / 40px, and 56px from 1920), on every screen. Past 1920 the headline caps have all been hit, so the root font-size scales instead and every rem-based size grows together: about 20% at 2560, capped at 137.5% for an ultrawide. One vertical token,
`--section-y` = 112 / 136 / 160px, with no per-section extras. Twelve columns
from 768px.

Borders are always exactly 1px `--hairline`. There are no rounded cards, no
shadows, and no elevated surfaces anywhere in this system.

### Pages

| Page | Sections |
|---|---|
| Home | 01 hero · 02 the reel (mirror wall, the top eleven first) · 03 what we believe · 04 the record · 05 who it was for (the roster) · 06 what we do · 07 how we work · 08 the top eleven (poster grid) · 09 what people say (the deck) · 10 who runs it · 11 start something (red band) · footer (red block) |
| Work | 01 the work · 02 the disciplines · 03 everything else (every piece not in the eleven) |
| Discipline | 01 discipline · 02 the brief · 03 the pieces · 04 more |
| 404 | 01 no such page |

---

## 5. Motion

### Tokens

| Token | Value |
|---|---|
| `--dur-quick` | 240ms |
| `--dur-base` | 600ms |
| `--dur-slow` | 1000ms |
| `--dur-reveal` | 1200ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` |

Smooth scroll: Lenis. All scroll animation: GSAP ScrollTrigger. One animation
library. Lenis is held while the loader, the menu, or the reel player is open.
ScrollTrigger refreshes revert pins, which blurs focus inside them; the scroll
provider hands focus back after every refresh.

### The vocabulary

Four moves, declared on server-rendered markup with `data-reveal` and played
by one client `Group`: a **line** rises out of a mask; a **rule** draws left
to right; a **fade** settles in with a 12px lift; a **frame** scales 1.08 → 1
under its clip. **No section uses a generic fade-and-slide-up.** Under
reduced motion nothing moves and everything is simply there. On touch, every text control grows to the 24px floor through padding on its inline box, so the line around it does not move.

### React Bits

Ten pieces from reactbits.dev, copied as their TypeScript + Tailwind sources
into `components/bits/` and dressed in the tokens. Three were reworked to fit:
ScrollVelocity is ported from `motion` to GSAP's ticker so the site keeps one
animation library; ScrollStack reads the page's own scroll instead of creating
a second Lenis; ScrollReveal scopes its cleanup instead of killing every
ScrollTrigger on the page. All are gated behind reduced motion.

| Piece | Where |
|---|---|
| SplitText | Every poster headline (via `Poster`). |
| ImageTrail | The hero: frames follow the pointer. |
| ScrollVelocity | The discipline ticker between the hero and the reel. |
| PixelTransition | Reel wall cells: hover pixelates into the discipline. |
| FlowingMenu / FlowingRow | Services rows (hover marquee of the offer's services); the work index. |
| ScrollStack | The process: four cards that stack. |
| CardSwap | The voices: a dealt deck of quote cards. |
| TextPressure | The footer wordmark: width and weight follow the cursor. |
| CurvedLoop | The line, curved and draggable, above the footer. |
| Magnet | Nav links, "Watch the reel", "Send it". |

### Every animated moment

| # | Moment | Trigger | Behaviour |
|---|---|---|---|
| 1 | Load sequence | Every load and refresh | The emblem draws itself stroke-first, core to wingtips (0.05–1.15s), and fills (0.85–1.3s), while "EXPERIENCE" sets itself letter by letter (0.1–1.1s) and "Media" writes itself in red script (1.0–1.9s). Holds until 2.25s. Letters and script lift out; the panel wipes up (2.5–3.4s) while the mark flies to its place in the nav on `expo.inOut`, so the logo you watched draw is the logo in the corner; the hero letters rise through the opening from 2.8s. Escape skips on the same choreography. |
| 2 | Nav condense | `scrollY > 64` | Height and type-size reduce; hairline appears. |
| 3 | Poster headlines | After loader (hero) or enter viewport | Every poster line rises letter by letter out of per-character masks, 28ms apart (React Bits SplitText on GSAP SplitText); the script writes in after. |
| 4 | The script | Enter viewport | Writes itself in left to right over the headline, a beat after the lines have risen. |
| 5 | Scroll cue | Continuous | 2px travel loop. |
| 6 | Scene open | Enter viewport | The poster lines rise out of their masks, 70ms apart; the script writes in. |
| 7 | The belief | Scroll through | Every word in its own mask; the words rise out of them in order, scrubbed to the scroll, 35ms apart. Not a slide. |
| 8 | The record | Enter viewport | The lead figure at poster-xl rolls up from zero over 1.7s on `expo.out`; three more follow in a row. |
| 9 | Rows | Enter viewport | Rule draws, title rises, body settles; 50ms stagger down the list. Services, process, work index, voices. |
| 10 | The top eleven | Enter viewport | The client's eleven best, ranked, on a six-column poster grid: landscape pieces two columns wide, portraits one wide and two tall. Frames settle from 1.08, captions follow, 60ms apart. The same grid carries the other pieces on the work page. |
| 11 | The roster | Enter viewport; scroll; hover | Every client set as a billing block of condensed caps, each name rising out of its own mask 30ms after the last. From 768px the block becomes an index: the scroll walks a beat down the names, the frame beside them cross-fades to that client's logo over `--dur-base`, and the name being read takes the ink back while the rest sit at `--ink-faint`, with the link underline (#14) wiping in beneath it. Pointing at a name holds the read there until the pointer leaves. Narrower, or under reduced motion, the frame is simply the whole logo wall and no name is ever dimmed. |
| 12 | Scene ground | Scroll | A tinted scene's colour is a layer under it, and it draws down over the paper as the scene arrives (95% to 30% of the viewport, scrubbed), the way a rule draws. Every scene headline also drifts 6% slower than the page around it. Full and still under reduced motion. |
| 13 | Footer | Enter viewport | The wordmark rises out of its mask at 19vw; "Media" writes itself across it in paper. |
| 14 | Link hover | Hover | Ink underline wipes left to right in `--dur-quick`. |
| 15 | Page transition | Route change | The paper veil dissolves off the incoming page over 450ms; scroll resets; triggers re-measure. |
| 16 | Mobile menu | Open | Links rise out of masks, 60ms stagger. |
| 17 | Hero | After loader; pointer; scroll | Three acts on one scroll. The poster: the headline condenses into place on the width axis (118 → 62) as its letters rise, its lines stepped; the pointer leaves a trail of work frames that pop in under it and fall away (React Bits ImageTrail, off on touch); the reel slaps in as a tilted sticker with a script tag and leans against the cursor. The takeover, scrubbed over the first viewport of scroll: the copy lifts out in the first fifth, line by line, before the picture is anything but a sticker; the sticker straightens and opens to the whole viewport; a flat ink floor comes up under it and one thing arrives on it, the ask to watch the reel, in paper. The curtain, over the next viewport: the reel holds still and the page slides up over it. The hero is sticky in a taller track and the next section starts a viewport early, so the curtain needs no pin and no script; under reduced motion the track collapses to one still viewport. |
| 18 | Mirror wall | Enter viewport; scroll | Sixteen frames in colour on a 5×5 grid in perspective, receding and fading toward the edges around the reel loop at the centre (3×3). The wall turns from -6° to 6° with the scroll. |
| 19 | Reel player | "Watch the reel" | Full-viewport takeover on ink, sound on, native controls. Settles over `--dur-base`, frame from 0.96. Escape closes; scroll is held; focus returns to the opener. |
| 20 | The deck | Enter viewport; every 6s; click | Seven paper cards in a skewed 3D stack (React Bits CardSwap) deal themselves: the front card drops, the rest step forward, it returns to the back, elastic. Hover pauses; a click deals. The front card's words are set large beside the deck and rise out of masks as it turns. |

---

## 6. Copy

First person plural, plain sentences, no agency throat-clearing. Strategy
first, results named, distribution and reporting included. Testimonials are
verbatim, Hinglish included; three are featured for being short and about
outcomes. Everything marked `DRAFT COPY` in the source is for the client's
review.

---

## 7. Why it looks like this

The reference is a poster wall, not a magazine. Condensed caps at the size of
a billboard say "we understand attention" before a word is read; the one red
script word across them is the human hand on the poster. Every section is a
scene because the client makes scenes for a living, and each scene has one
thing in it because attention is the product. The mirror wall and the fold
gallery are the two set pieces — the work shown as spectacle, not as a grid
— and the two red blocks are where the site stops performing and asks. It is
all on paper rather than black because the client asked for light, and
because on paper the red reads as a signature instead of a warning.
