# Experience Media — Design System

**Status:** proposed, awaiting approval
**Branch:** `redesign/studio`
**Stack:** Next 16 App Router · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis

---

## 1. Colour

Six values. Near-black base, warm off-white type, one saturated red.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#0A0A0B` | Page base. The only background colour on the site. |
| `--bone` | `#F4F0EA` | Primary type. Warm, so it never reads as clinical white on black. |
| `--bone-dim` | `rgba(244,240,234,0.62)` | Body prose, secondary type. ~7.6:1 on `--void`. |
| `--bone-faint` | `rgba(244,240,234,0.5)` | Labels, metadata. ~5.0:1 — the floor for normal text. |
| `--hairline` | `rgba(244,240,234,0.12)` | 1px rules and dividers. The only border colour. |

The alpha ramp is set by measured contrast, not by eye. `--bone-faint` was
originally 0.3 (~2.6:1) and failed axe-core on every route; `npm run audit`
is what caught it.
| `--signal` | `#FF2D20` | **The accent.** Saturated red. |
| `--ember` | `#3D0A06` | Deep red, used *only* as the inner stop of ambient radial gradients. |

### Where the accent is allowed to appear

Exhaustive. If it appears anywhere else, that is a bug:

1. **Ambient glow** — soft `--ember` → transparent radial gradients behind the hero and behind exactly one mid-page section break. Never more than two on a page.
2. **Interactive hover** — the underline that draws on link hover.
3. **Focus ring** — 2px `--signal` outline on keyboard focus.
4. **Scroll cue** — the single hero scroll indicator.
5. **Current-page marker** in the nav — a 4px dot, nothing more.

Explicitly forbidden: coloured words inside headlines, accent-filled buttons, accent section backgrounds, accent on statistics, accent icons.

### Deliberately not doing

No secondary accent. No greys beyond the three alpha steps of `--bone`. Client logos render greyscale at 55% opacity, full opacity on hover — never tinted.

---

## 2. Typography

### Families and licence

| Role | Family | Licence | Hosting |
|---|---|---|---|
| Display | **Archivo** (variable: `wght` 100–900, `wdth` 62–125) | SIL Open Font Licence | Self-hosted + subset by `next/font/google` at build time |
| Body | **Inter Tight** (variable: `wght` 100–900) | SIL Open Font Licence | Same |

**Why this pair.** The reference sets a heavy squarish grotesk against a neutral one. Archivo pushed to `wdth: 115–125` at weight 700+ produces exactly that dense, squared display personality; Inter Tight is narrow and quiet by construction. The two differ on the *width* axis, not just weight, which is what keeps them from reading as two versions of the same face. Archivo's width axis is also the one genuinely distinctive typographic move available to us for free.

`next/font/google` downloads, subsets to `latin`, and serves both from our own origin — no third-party font requests, no FOUT beyond `display: swap`. Only the display face used in the first viewport is preloaded.

### Scale

Fluid via `clamp()`. Tracking tightens as size grows.

| Role | Size | Weight | Width | Line height | Tracking |
|---|---|---|---|---|---|
| `display-xl` | `clamp(3.25rem, 11vw, 10.5rem)` | 700 | 118 | 0.94 | −0.035em |
| `display-l` | `clamp(2.5rem, 7.5vw, 6.5rem)` | 700 | 112 | 0.98 | −0.03em |
| `display-m` | `clamp(2rem, 4.5vw, 3.75rem)` | 600 | 105 | 1.04 | −0.025em |
| `heading` | `clamp(1.5rem, 2.6vw, 2.25rem)` | 600 | 100 | 1.15 | −0.02em |
| `lede` | `clamp(1.25rem, 2vw, 1.75rem)` | 400 | — | 1.42 | −0.015em |
| `body` | `1.0625rem` | 400 | — | 1.6 | −0.01em |
| `small` | `0.875rem` | 400 | — | 1.5 | −0.005em |
| `micro` | `0.8125rem` | 400 | — | 1.4 | 0 |

**Micro labels are parenthetical and lowercase** — `(selected work)`, `(what we do)` — set in Inter Tight at `micro`, in `--bone-dim`. There are **no tracked-out all-caps eyebrows anywhere on this site**.

Sentence case throughout. Headlines may open conversationally.

---

## 3. Space and grid

**Spacing scale** (4px base): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 · 256`

**Container:** `1560px` max width.

| Breakpoint | Columns | Gutter | Page padding |
|---|---|---|---|
| ≥1280px | 12 | 24px | 40px |
| 768–1279px | 8 | 20px | 32px |
| <768px | 4 | 16px | 20px |

**Vertical rhythm:** sections separate by `128px` mobile / `192px` desktop. Section-internal blocks separate by `48–64px`. Full-bleed by default; left-aligned by default. Two-column splits put a parenthetical label in the left column opposite prose in the right.

Borders are always exactly `1px` `--hairline`. There are no rounded cards, no shadows, and no elevated surfaces anywhere in this system.

---

## 4. Motion

### Tokens

| Token | Value |
|---|---|
| `--dur-quick` | 240ms |
| `--dur-base` | 600ms |
| `--dur-slow` | 1000ms |
| `--dur-reveal` | 1200ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` |
| `--ease-marquee` | `linear` |

Smooth scroll: Lenis. All scroll animation: GSAP ScrollTrigger. **One animation library — GSAP.** framer-motion is removed.

### Every animated moment on the site

| # | Moment | Trigger | Behaviour |
|---|---|---|---|
| 1 | Page load sequence | First visit, once per session | Emblem draws stroke-first centre-outward, wordmark rises, panel lifts. Skippable. |
| 2 | Nav condense | `scrollY > 64` | Height and type-size reduce; hairline appears. |
| 3 | Hero headline | On load, after loader | Line-by-line mask reveal, 90ms stagger. |
| 4 | Hero ambient glow | Continuous | Slow 14s drift of the `--ember` radial. |
| 5 | Scroll cue | Continuous | 2px vertical travel loop, fades out past 15% scroll. |
| 6 | Logo marquee | Continuous | Horizontal `linear` loop, pauses on hover. |
| 7 | Positioning statement | Enter viewport | Word-by-word opacity wipe, 24ms stagger. Not a slide. |
| 8 | Credibility figures | Enter viewport | Digits roll up in a masked column. |
| 9 | Services rows | Scroll through | Hairline draws L→R. The active row's **title** lifts to full opacity, inactive titles sit at 45%. Body copy never dims — compounding opacity onto `--bone-dim` drops it below AA. Under reduced motion nothing dims at all. |
| 10 | Selected work | Scroll | Cards pin and stack, each releasing the previous. |
| 11 | Testimonial columns | Scroll | Two columns at differing scroll speeds (0.9× / 1.15×). |
| 12 | Founder portrait | Enter viewport | Scale 1.06 → 1 under a clip mask. |
| 13 | Footer CTA | Enter viewport | Headline mask reveal. (No standing accent underline — that would exceed the five-use colour limit in §1; the CTA uses the hover underline like every other link.) |
| 14 | Link hover | Hover | Accent underline wipes L→R in `--dur-quick`. |
| 15 | Page transition | Route change | Content cross-dissolves over 320ms; scroll resets. |

**No section uses a generic fade-and-slide-up.** Reveals differ by section on purpose: masks, wipes, word stagger, pinning, roll-ups.

**`prefers-reduced-motion`:** every one of the above resolves instantly to its end state. Content still reveals — it simply arrives. The marquee becomes a static row, pinning is disabled, the loader holds 400ms then clears.

---

## 5. Principles

Experience Media is a post house, so the site earns its authority by showing work at scale rather than describing it — the largest elements on any screen are the work itself and the words, never an ornament. The palette is near-monochrome so that the single red carries real meaning on the five occasions it appears, and the warm off-white keeps the darkness feeling like a grade rather than a default dark mode. Type does the structural work that borders and cards would do in a lesser system, which is why the width axis matters more here than any decorative flourish. The studio is founder-led and the writing reflects that: first person plural, plain sentences, no agency throat-clearing. And because the client's craft is motion, every transition on this site has to survive being watched by someone who edits video for a living — which means orchestrated, varied, and never bolted on.

---

## 6. Self-critique

Per the brief, I reviewed the above for anything that is merely "generic dark portfolio". Four things changed as a result:

1. **The type pairing was originally Archivo + Geist.** Both are neutral grotesks at similar widths — two lookalikes, exactly what the brief warns against. Swapped to Inter Tight and, more importantly, committed to *driving Archivo's width axis* so the display face is genuinely squared and dense rather than just large. The width contrast is now the point.

2. **Section numbering was in the first draft** (`01 / 02 / 03` against services). Services are a menu, not a sequence — the brief rejects this, and it was reflexive. Removed. The only positional indicator left is the testimonial carousel, which is genuinely positional.

3. **The reveal list was one row saying "sections fade up on enter".** That is the default the brief explicitly rejects. Rewritten as fifteen distinct moments with different mechanics, so no two adjacent sections arrive the same way.

4. **The accent had no spending limit.** I had it on stats, buttons and headline fragments — which is how a single accent becomes decoration and stops meaning anything. Now capped at five enumerated uses, with a forbidden list.

Remaining tension I have not resolved, and want your view on: the testimonials are in Hinglish and are warm and informal ("Bhai, salute hai kaam ko!"), while the rest of the site is being written as restrained and editorial for a brand audience. That contrast could read as authentic range, or as two different companies. I lean toward keeping them verbatim — they are real, and sanding them into corporate English would be worse — but it is a genuine judgement call.

---

## 7. Wireframe — Home

```
┌──────────────────────────────────────────────────────────────────────┐
│  Experience Media ▪                    index   work   studio   talk  │ fixed nav, condenses
└──────────────────────────────────────────────────────────────────────┘

        ·  ambient ember glow, slow drift  ·

        (a content studio, new delhi)

        We make things
        people finish
        watching.

        Founder-led video and content for brands            ← lede, col 1-6
        that need output, not decks.

        ▏ scroll                                            ← accent cue
─────────────────────────────────────────────────────────────────────── hairline

   ←  HYUNDAI   MYGOV   ZERODHA   LENSKART   ODOO   THINK SCHOOL  ←     greyscale marquee

───────────────────────────────────────────────────────────────────────

  (what we believe)      We started as creators, which means we build
                         for the algorithm and the audience at the same
                         time. Most studios pick one.
                                                                        ← word-wipe reveal
                         Everything is made in-house — strategy through
                         final grade — so nothing gets lost in a handoff.

───────────────────────────────────────────────────────────────────────

  300,000,000+           15 brands           9 creators        8 yrs
  views in two months    partnered           collaborated      running
                                                                        ← digits roll up
───────────────────────────────────────────────────────────────────────

  (what we do)

  Content Engine                      Always-on output. Short-form that
                                      travels, long-form that compounds.
  ─────────────────────────────────────────────────────────────────────
  Brand Films                         Single pieces made to carry weight.
  ─────────────────────────────────────────────────────────────────────
  Post & VFX                          The craft layer. Compositing, CGI,
                                      finishing.
  ─────────────────────────────────────────────────────────────────────
  Strategy & Enablement               We build the system, then train
                                      your team to run it.
                                                        ← active row lifts, others 40%
───────────────────────────────────────────────────────────────────────

  (selected work)

  ┌────────────────────────────────┐   Motion Graphics
  │                                │   6 pieces · YouTube
  │        [ 16:9 still ]          │   Explainers and data animation
  │                                │   built for retention.
  └────────────────────────────────┘
                                        ┌──────────────────────────────┐
  Short Format                          │                              │
  11 pieces · Instagram                 │       [ 9:16 still ]         │
  Reels cut for the first two seconds.  │                              │
                                        └──────────────────────────────┘
                                                        ← cards pin and stack
  ... VFX & CGI · Long-Form · Podcast

───────────────────────────────────────────────────────────────────────

  (kind words)                                              01 / 07

  ┌──────────────────┐  ┌──────────────────┐
  │ "Sach bolu to    │  │ "..."            │
  │  bhai, jaise     │  │                  │    two columns,
  │  kandhe se pura  │  │  — Varnit Singh  │    differing speeds
  │  bojh utar gaya  │  │     Influencer   │
  │  ho!"            │  └──────────────────┘
  │                  │  ┌──────────────────┐
  │  — Kanchhiiii    │  │ "..."            │
  │     Creator      │  │                  │
  └──────────────────┘  └──────────────────┘

───────────────────────────────────────────────────────────────────────

  (who runs it)

  ┌─────────────┐    Parth Malhotra
  │             │    Founder
  │  [portrait] │
  │             │    A creator who got tired of briefing editors who
  └─────────────┘    had never posted anything. Started the studio to
                     close that gap.
───────────────────────────────────────────────────────────────────────

        Tell us what you're
        trying to move.
        ─────────────────                       ← accent underline draws once

        parthmalhotra@experiencemedia.in
        +91 85957 53414

        youtube  instagram  linkedin  threads  x  facebook
        © 2026 Experience Media          New Delhi · IN
```

## 8. Wireframe — Case study (`/work/[discipline]`)

Case studies are **per discipline**, populated from the real portfolio pieces — no invented client narratives.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Experience Media ▪                    index   work   studio   talk  │
└──────────────────────────────────────────────────────────────────────┘

        (discipline)

        Motion
        Graphics

        Scope              Platform           Pieces         Period
        Explainer,         YouTube            6              2024—25
        data animation
───────────────────────────────────────────────────────────────────────

  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │                    [ lead still — 16:9 ]                         │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘

  (context)        Creators in the explainer space were all reaching for
                   the same Vox-style visual grammar, and viewers had
                   stopped seeing it.

  (problem)        Retention was collapsing at the 40-second mark, right
                   where the data section began.

  (approach)       We rebuilt the data sequences as continuous camera
                   moves rather than cuts, so the graph never resets the
                   viewer's attention.

  ┌───────────────────────────┐  ┌───────────────────────────┐
  │      [ still 16:9 ]       │  │      [ still 16:9 ]       │
  └───────────────────────────┘  └───────────────────────────┘

        "Bar graph animation like Vox — but it had to
         feel like ours, not theirs."
                                                        ← pull quote

  (outcome)        [ measurable result — TO BE SUPPLIED, flagged ]

  The pieces
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ [16:9]   │ │ [16:9]   │ │ [16:9]   │   → real YouTube links
  └──────────┘ └──────────┘ └──────────┘

───────────────────────────────────────────────────────────────────────
  prev                                                            next
  Short Format                                             VFX & CGI
```

---

## 9. What I plan to delete

`components/webgl/*` (7 files), `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/postprocessing`, `maath`, `troika-three-text`, `motion`, `framer-motion`,
`components/chrome/*` (Scrubber, Timecode, FrameMarks, CursorReadout), the `.eyebrow`
class and all 52 usages, the `↗` link arrows, and the draft brand case studies in
`lib/content/work.ts`.
