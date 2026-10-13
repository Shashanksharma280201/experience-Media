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

Warm paper, charcoal ink, one red. Eight tokens; the band step shares the red, since the red clears 4.9:1 on ink.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4F0EA` | Ground. The only light background on the site. Warm, never pure white: the ground the red was chosen for. |
| `--ink` | `#15171A` | Type, and the ground of the band. |
| `--ink-dim` | `rgba(21,23,26,0.72)` | Body prose. 6.9:1 on paper. |
| `--ink-faint` | `rgba(21,23,26,0.65)` | Labels, numerals. 5.4:1, the floor for normal text. |
| `--hairline` | `rgba(21,23,26,0.14)` | 1px rules. The only border colour on paper. |
| `--paper-deep` | `#E9E4DD` | Media placeholder, under thumbnails only. |
| `--signal` | `#FF2D20` | **The accent.** 3.5:1 on paper, so it is only ever set large; the script never goes under 24px. |
| `--signal-band` | `#FF2D20` | The accent on the band: the same red, 4.9:1 on ink. The token stays so the band can take its own step if the red ever changes. |

On the band the type ramp inverts: paper, `--paper-dim` (0.72, 9.0:1), `--paper-faint` (0.60, 6.6:1), `--hairline-dark` (0.16).

The alpha ramp is set by measured contrast, not by eye; `npm run audit` checks it on every route and `app/globals.test.ts` pins the values.

### Where the accent is allowed to appear

1. **The script** — one word in Pinyon Script laid across a poster headline. Never a whole sentence. On the band it is `--signal-band`.
2. **The red block** — the footer, full-bleed, with ink type. On the charcoal band the accent is the script, the selection and the focus ring only.
3. **The loading screen's script** — the wordmark's "Media".
4. **Focus ring**, **scroll cue**, **current-page marker**, **selection**.

Forbidden: red words inside running copy, red buttons, red rules, glows,
gradients, and any second hue. The tints of v3 are retired: colour comes from the
work now.

### The band, and the red block

The charcoal scenes: the numbers, the process, the voices, About's question, the
contact band, About's statement. A dark scene is a `.scene-ground` layer under
the scene so it draws in on scroll like the tints did; the contact band and
About's statement are solid (`.band`) because that is where the site stops
performing. The footer is the red block (`.band--signal`): ink type on the
accent, the script in paper, the sign-off.

### The mark

The emblem (`components/brand/Emblem.tsx`) appears beside the wordmark in the nav,
above the wordmark in the loader, and in the footer's red block. It inherits the
text colour: ink on paper, paper on the band, ink on the red.

### Deliberately not doing

No secondary accent. No greys beyond the three alpha steps of ink. Client logos
render flat ink at 60%, full on hover.

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

**The script.** Pinyon Script, red (`--signal-band` on the dark scenes), one word, rotated -6°, laid over the end of its line with its right
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
A scene is paper or dark; `tone="dark"` gives it a charcoal ground that draws in on scroll (motion #12).

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
| Home | 01 hero (the frame, with the strip) · 02 the reel (mirror wall) · 03 what we believe (with media) · 04 the founder story (with media) · 05 the numbers (dark) (with media) · 06 who we work with (audiences, then the roster) (with media) · 07 the offer (with media) · 08 services (three legs) · 09 capabilities (the band) (with media) · 10 process (dark) (with media) · 11 the work (poster grid) · 12 what people say (the deck, dark) · 13 Founder's Corner (with media) · 14 training (with media) · 15 the conversation (band) · footer (red block) |
| Work | 01 the work · 02 the disciplines · 03 the complete portfolio |
| Discipline | 01 discipline (tagline, reach, platforms, period) · 02 the line · 03 the pieces · 04 more |
| About | 01 the headline · 02 the story · 03 the question (dark) · 04 the principle · 05 the brand statement (band) |
| Production | 01 wherever the story needs to happen · 02 what we shoot |
| Training | 01 learn the system · 02 the playbook and its form · 03 coming next |
| Contact | the conversation, as a page |
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
| ImageTrail | Retired from the hero on 2026-10-13 (the source stays in `components/bits`). |
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
| 7 | The belief | Scroll through | Every word in its own mask; the words rise out of them in order, scrubbed to the scroll, 35ms apart. Not a slide. As the last words land, "honestly" writes itself in just past the full stop, anchored to the last word like every poster's script. |
| 8 | The record | Enter viewport | The lead figure at poster-xl rolls up from zero over 1.7s on `expo.out`; three more follow in a row. |
| 9 | Rows | Enter viewport | Rule draws, title rises, body settles; 50ms stagger down the list. Services, process, work index, voices. |
| 10 | The top eleven | Enter viewport | The client's eleven best, ranked, on a six-column poster grid: landscape pieces two columns wide, portraits one wide and two tall. Frames settle from 1.08, captions follow, 60ms apart. The same grid carries the other pieces on the work page. |
| 11 | The roster | Enter viewport; scroll; hover | Every client set as a billing block of condensed caps, each name rising out of its own mask 30ms after the last. From 768px the block becomes an index: the scroll walks a beat down the names, the frame beside them cross-fades to that client's logo over `--dur-base`, and the name being read takes the ink back while the rest sit at `--ink-faint`, with the link underline (#14) wiping in beneath it. Pointing at a name holds the read there until the pointer leaves. Narrower, or under reduced motion, the frame is simply the whole logo wall and no name is ever dimmed. |
| 12 | Scene ground | Scroll | A dark scene's charcoal is a layer under it, and it draws down over the paper as the scene arrives (100% to 70% of the viewport, scrubbed, little lag, so the edge always leads the type), the way a rule draws. Every scene headline also drifts 6% slower than the page around it. Full and still under reduced motion. |
| 13 | Footer | Enter viewport | The wordmark rises out of its mask at 19vw; "Media" writes itself across it in paper. |
| 14 | Link hover | Hover | Ink underline wipes left to right in `--dur-quick`. |
| 15 | Page transition | Route change | The paper veil dissolves off the incoming page over 450ms; scroll resets; triggers re-measure. |
| 16 | Mobile menu | Open | Links rise out of masks, 60ms stagger. |
| 17 | Hero | After loader; pointer; scroll | The frame. Footage fills the viewport under a 0.5 ink scrim; the headline condenses in over it on the width axis (118 → 62) as its letters rise, the strip and the Watch button follow. Over the first viewport of scroll the copy leaves in the first fifth, the scrim lifts and the footage clips to a card at the right while the paper page rises under it; the next scene then rides over the track's tail (the curtain). The hero is sticky in a taller track and the next section starts a viewport early, so the curtain needs no pin and no script. Reduced motion: one still viewport, the poster frame. |
| 18 | Mirror wall | Enter viewport; scroll | Sixteen frames in colour on a 5×5 grid in perspective, receding and fading toward the edges around the reel loop at the centre (3×3). The wall turns from -6° to 6° with the scroll. |
| 19 | Reel player | "Watch the reel" | Full-viewport takeover on ink, sound on, native controls. Settles over `--dur-base`, frame from 0.96. Escape closes; scroll is held; focus returns to the opener. |
| 20 | The deck | Enter viewport; every 6s; click | Seven paper cards in a skewed 3D stack (React Bits CardSwap) deal themselves: the front card drops, the rest step forward, it returns to the back, elastic. Hover pauses; a click deals. The front card's words are set large beside the deck and rise out of masks as it turns. |
| 23 | Loops and frames | In view | Every loop beside copy is silent, plays only while on screen, and is a still under reduced motion. The founder frame is a labelled slot until the photo exists. |

---

## 6. Copy

Every line of copy, every figure and the section order come from the October 2026 redevelopment brief (`Experience_Media_Website_Redevelopment_Brief.docx`, §3–§9). The content layer is `lib/content/`: `proof.ts` holds the approved metrics, the process, the offer, the audiences and training; `capabilities.ts` the three legs, the fifteen capabilities and production; `founder.ts` the story; `work.ts` the discipline copy and reach figures. No count of pieces appears anywhere on the site, and no figure is derived from an array length. The accent is the red the site has carried since v3, kept by the client's choice over the brief's blue; see §1.


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
— and the two bands are where the site stops performing and asks. It is
all on paper rather than black because the client asked for light, and
because on paper the red reads as a signature instead of a warning.
