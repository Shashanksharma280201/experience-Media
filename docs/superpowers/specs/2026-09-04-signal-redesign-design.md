# Signal — the end-to-end redesign

**Date:** 2026-09-04 · **Branch:** `redesign/studio` · **Status:** approved in conversation, implementing

## What this is

Experience Media is a founder-led marketing agency in New Delhi. The site's job is
to make a brand's marketing lead feel, within one scroll, that this agency knows
how attention works and can prove it. Every page is built from one grammar and
one motif, so the whole site reads as a single object.

## The motif: the signal line

One red hairline runs down the left margin of every page, at half a gutter from
the viewport edge. It is drawn by the visitor: as you scroll, the line extends to
wherever you have reached, with a 5px dot as its pen tip. Every section registers
on it with a 10px tick and a two-digit numeral. The footer is where the line
arrives. It is the only structural use of the accent; the accent's other uses are
the nav's current-page dot, the focus ring, the hero scroll cue, and selection.
The ambient glows of the previous system are gone — one motif, not two.

The loading screen is the motif's origin. On paper, the line draws left to right
across the vertical centre. The emblem fills upward onto it, and the wordmark
rises beneath. The composition holds until 2.4s. Then the emblem and wordmark
lift away, the line collapses toward the left-margin point, and the panel lifts,
revealing the page with its margin line already drawn to the first viewport. The
loader becomes the site.

## Colour

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4F0EA` | Ground. The only background. |
| `--ink` | `#0A0A0B` | Type. |
| `--ink-dim` | ink at 72% | Body prose. ~7.8:1 on paper. |
| `--ink-faint` | ink at 60% | Labels, numerals, metadata. ~5.0:1, the floor. |
| `--hairline` | ink at 14% | Rules. |
| `--paper-deep` | `#E9E4DD` | Media placeholder only. |
| `--signal` | `#FF2D20` | The line and the four small uses above. Never on words, never as a fill behind content. |

## Type

Archivo (display, width axis) and Inter Tight (text). Five tiers, used consistently:

| Tier | Size | Where |
|---|---|---|
| `display-xl` | clamp(2.4rem, 8.2vw, 8rem), wdth 118 | Hero headline only. The largest type on the site, by design. |
| `display-l` | clamp(2.25rem, 5.2vw, 4.5rem), wdth 112 | Every section headline; page titles; the strip word. |
| `display-m` | clamp(1.75rem, 3.6vw, 3rem), wdth 105 | Row titles, statements, pull quotes, figures. |
| `lede` | clamp(1.2rem, 1.8vw, 1.5rem) | Section prose. |
| `small` / `micro` / `num` | 0.875rem / 0.8125rem | Metadata; the parenthetical label; tabular numerals. |

## The section grammar

Every section, on every page, is:

```
[tick]  01  (label)
        Headline at display-l                          optional aside, right
        ─────────────────────────────────────────────────────────────────────
        content
```

Rows inside sections share one anatomy: hairline, numeral in the first column,
title at `display-m` in columns 2–5, body in columns 7–12. Services, process,
work cards, and work-index rows are all this row. Vertical rhythm is one token,
`--section-y` (112 / 136 / 160px), with no per-section extras.

## Home, in order

| # | Label | Headline | Content |
|---|---|---|---|
| 01 | Experience Media — marketing agency, New Delhi | We make things people finish watching. | Lede, "Watch the reel", scroll cue; the reel window; the founder portrait behind. |
| 02 | the reel | *(the discipline word)* | The pinned film strip. |
| 03 | what we believe | We started as creators… | Word-wipe statement at display-l, second statement at display-m. |
| 04 | the record | Numbers we'll put our name to. | Four figures; proof rows: brand marquee, creator faces. |
| 05 | what we do | Four ways in, strategy first. | Four offer rows. |
| 06 | how we work | Brief to published in four moves. | Four numbered step rows. |
| 07 | selected work | Five disciplines, 35 pieces. | The pinned card stack. |
| 08 | what people say | In their words. | Three featured pull quotes; the rest behind "more voices". |
| 09 | who runs it | Parth Malhotra | Story, links. |
| 10 | start something | Brief us in a paragraph. | The form. |

Work index: 01 the work / 02 the disciplines / 03 a sample. Work detail: 01
discipline / 02 the brief / 03 the pieces / 04 more. 404: 01 no such page.

## Copy

Draft, flagged for review, in the house voice: first person plural, plain
sentences, no agency throat-clearing. Reframed from "post house" to agency:
strategy first, results named, distribution and reporting included. Testimonials
stay verbatim; three are featured for being short and about outcomes.

## Motion

The existing vocabulary — mask rise, hairline draw, settle, frame scale — plus
the line. No generic fade-and-slide. Every moment is a row in DESIGN.md §4.
Reduced motion: everything arrives; nothing pins; the line is fully drawn.

## Implementation order

1. Tokens, type, grammar, line, loader (`globals.css`, `Section`, `Signal`, `Intro`).
2. Content reframe (`site`, `capabilities`, `proof`).
3. Home sections in order; footer; nav.
4. Work index, work detail, 404, OG image.
5. DESIGN.md rewritten as v2. Build, audit, lint, tests, motion probes, screenshots.


---

## v3 addendum (2026-09-05): "Poster"

After Signal shipped, the user pointed at WarholArts (warhol-arts.webflow.io)
as the reference and chose, explicitly: poster type (condensed caps with a
script overlay), one full-viewport scene per section, the mirror wall and the
fold gallery as set pieces, solid red blocks for the contact ask and the
footer, and a poster loader. Light theme kept.

What changed against v2: the signal line, ticks, and `Section` grammar are
replaced by `Scene` + `Poster`; the hero, reel, work, contact and footer are
rebuilt as scenes; the loader sets the wordmark and writes the script; the red
is spent on scripts and blocks. Archivo's width axis at 62 supplies the
condensed face, so no new display licence is needed; Pinyon Script (OFL) is
the script. DESIGN.md is v3.
