# Experience Media — "Cutting Room" Redesign Design

**Date:** 2026-08-26
**Status:** Approved
**Supersedes:** `2026-06-24-experience-media-redesign-design.md` (v1 light editorial),
and rescopes `2026-06-24-content-multiverse-webgl-design.md` (WebGL layer).

**Goal:** Rebuild experiencemedia.in as a brand-facing agency site in the register of
[wearedirect.co](https://wearedirect.co/) and the awwwards design-agency winners —
dark, type-led, results-forward — with a new content model built on real case studies.

## Why this replaces v1

v1 shipped a competent light editorial site whose portfolio is a thumbnail grid linking
out to YouTube and Instagram. Visitors leave rather than go deeper, and there is no
narrative connecting the 15 brand logos to the 37 pieces of work. The redesign's central
change is structural, not cosmetic: **flagship case studies become the argument**, and
the outbound links become a footnote.

## Locked decisions

| Area | Decision |
|------|----------|
| Scope | Full rebuild — new visual language *and* new content model |
| Primary audience | Brands / businesses; goal is winning retainers |
| Art direction | "Cutting Room" post-production language, held to "Ledger" restraint |
| Palette | Dark-dominant; paper becomes a deliberate inversion |
| Display type | Archivo (variable: weight + width) — replaces Geist |
| Technical type | JetBrains Mono — timecodes, slates, metadata |
| Accent | Single gold `#E3A90F`. No second accent, including no record-red |
| Case studies | Full detail for 3–6 flagships; all other work as an index |
| WebGL | Demoted from hero to three signature moments |
| CMS | None. Content is static TypeScript |

## Art direction

### Palette

Dark is the default; paper appears only as an inversion (§05 Point of View, and the
404). Tokens are defined in `app/globals.css` under Tailwind v4 `@theme`.

| Token | Value | Role |
|---|---|---|
| `--color-void` | `#0B0A09` | Page default — warm near-black, inherited from v1 `night` |
| `--color-surface` | `#141311` | Raised cards, case-study panels |
| `--color-ink` | `#F4F2EE` | Primary text on dark |
| `--color-ink-muted` | `#8C887F` | Metadata, mono furniture |
| `--color-rule` | `rgba(244,242,238,0.12)` | 1px hairlines — the structural workhorse |
| `--color-accent` | `#E3A90F` | Gold, brightened for dark ground |
| `--color-paper` | `#F4F2EE` | Inversion sections only |

**One accent, no exceptions.** Gold carries active and record state; the post-production
furniture does not get its own colour.

### Typography

- **Display — Archivo.** Variable, exposing weight and width axes. The width axis drives
  the hero's scroll-linked compression.
- **Technical — JetBrains Mono.** Timecodes, reel indices, deliverable tracks, metrics
  labels, aspect badges.

Both load via `next/font/google` with `display: swap` and a metric-matched fallback stack.

**Verification requirement:** confirm Google Fonts exposes Archivo's `wdth` axis before
implementing scroll-linked width. If it does not, the hero animates `wght` only; the rest
of the system is unaffected. This check happens in the first implementation task, not at
integration time.

### The Cutting Room furniture

Exactly five elements. The direction fails if it becomes costume, so this list is closed —
adding to it requires revisiting this spec.

1. **Timecode section markers** — `00:03:12:04 · REEL 03 — CAPABILITIES` in mono.
   Replaces v1's `[ 01 — SERVICES ]` brackets. The timecode is *deterministic per
   section*, not live: the page is treated as a fixed-length reel and each section's
   marker is its start offset, computed from its index and measured document position at
   build/mount time. It does not tick with scroll — only the scrubber's readout does.
2. **Framing marks** — 1px corner brackets on media and cards, like camera framing
   guides. Muted at rest, accent on hover.
3. **The scrubber** — the page-level progress bar becomes a timeline: tick marks at
   section boundaries, a playhead, and a live timecode readout.
4. **Track stacks** — case-study deliverables rendered as timeline tracks (`V1 · V2 · A1`).
5. **Aspect badges** — `16:9` / `9:16` on work items, from the existing `aspect` field.

Explicitly rejected: waveform dividers, clapperboard graphics, film-strip borders.

Film grain carries over from v1 unchanged.

## Structure

### Routes

```
/                  home
/work              work index + WebGL constellation   (replaces /portfolio)
/work/[slug]       flagship case study                (new)
/portfolio         permanent redirect → /work
```

All routes are statically generated. `/api/contact` remains the only dynamic route.

### Home sequence

| # | Section | Job |
|---|---|---|
| 01 | Hero | Type-led positioning + showreel. No WebGL. |
| 02 | Selected work | 3–6 flagship case studies, each linking to its route |
| 03 | Capabilities | The 9 services grouped into exactly 4 offers (see below) |
| 04 | Proof | 300M+ lead figure plus per-client metrics |
| 05 | Point of view | The studio's stated belief. Paper inversion. |
| 06 | Clients | Brand wall + creator strip |
| 07 | Contact | Closing bookend |

Two deliberate departures from v1: **work moves to 02**, because a brand buyer wants proof
before philosophy; and **the brand wall drops to 06**, because once real case studies
exist, logos become supporting evidence rather than the argument itself.

### Capability grouping

v1 presents nine sibling services, which reads as a freelancer's rate card rather than an
agency's offer. They regroup into four offers, with every service retained:

| Offer | Services absorbed |
|---|---|
| **Content Engine** | Viral Social Media Content · Podcast Production Service |
| **Brand Films** | Ad Production Service · Music Videos · Storytelling Documentary · Event Photography & Videography |
| **Post & VFX** | VFX And CGI |
| **Strategy & Enablement** | Strategic Content Consultancy · Team Training & System Enhancement |

Post & VFX intentionally holds a single service: it is the offer the WebGL proof moment
(§WebGL, moment 2) demonstrates, and merging it would bury the one capability the site can
prove in the browser rather than assert.

### Case study shape

```ts
type CaseStudy = {
  slug: string
  client: string; logo: string; year: string; category: string
  headline: string                              // one-line positioning
  challenge: string; approach: string           // the narrative
  deliverables: string[]                        // → track stack
  metrics: { label: string; value: string }[]   // → metric ledger
  media: { type: 'video' | 'image'; src: string; poster?: string; aspect: string }[]
  links: { label: string; href: string }[]      // outbound to YT/IG, now secondary
  testimonial?: { quote: string; author: string; role: string }
}
```

Every field except `testimonial` is required. A case study missing required content does
not ship as a flagship — it stays in the work index until its content is complete.

### Required content inputs

Two inputs come from the client and are not derivable from the existing codebase.

**Flagship selection and material.** Three to six clients, each with brief, approach,
deliverables, and publishable numbers. **Default set if none is designated:** Hyundai,
Lenskart, Zerodha Zero1, MyGov — the four highest-recognition brands already in
`lib/content.ts`. Implementation proceeds against the schema with the default set; real
copy replaces placeholder strings before launch, and launch is blocked on that
replacement.

**Point of view (§05).** One stated belief, equivalent in function to Direct's
"AI-second policy" — roughly a headline plus three to five supporting principles.
This section is what makes the site memorable rather than merely competent. If no copy is
supplied, §05 is omitted from launch rather than shipped with filler; the home sequence
renumbers accordingly.

### Content module

`lib/content.ts` currently runs 201 lines across six responsibilities and would exceed 500
under the case-study model. It becomes a directory:

```
lib/content/
  site.ts          site meta, contact, socials
  work.ts          case studies + full work index
  capabilities.ts  grouped service offers
  proof.ts         stat + telemetry metrics
  clients.ts       brands + creators + testimonials
  index.ts         re-exports
```

`index.ts` re-exports every existing binding, so current component imports keep working
through the migration.

## Motion

Lenis smooth scroll carries over from v1. The governing rule is Ledger discipline:
**nothing animates that isn't communicating.** Every behaviour below has a
`prefers-reduced-motion` path, following the pattern already established in v1.

- **Hero kinetic type** — Archivo's width axis maps to hero scroll progress: expanded at
  rest, compressing on descent. This is the *only* kinetic-type moment on the site.
  The line box is reserved at maximum width so compression cannot reflow; zero CLS is a
  requirement, not an aspiration.
- **Section reveals** — hairline rules draw left-to-right, headings line-mask up, mono
  timecodes fade in. Extends v1's existing `Reveal` component.
- **Scrubber** — timeline with section ticks and live timecode, driven by the shared
  scroll context.
- **Page transitions — "the cut"** — route changes perform a hard black cut rather than a
  crossfade: opacity steps 0→1→0 with no easing, holding black for **80ms** (two frames
  at 24fps), total duration under 200ms. Must preserve scroll restoration and not
  desynchronise Lenis.
- **Cursor readout** — a mono label tracking the pointer over hoverable media
  (`PLAY ▸ 16:9 · 00:47`). Fine-pointer only, gated by the coarse-pointer check already
  present in `pickTier`.
- **Marquees and count-up** — carried over from v1, restyled to the new palette.

**Reduced motion:** no width-axis animation, instant route changes, no cursor readout,
static marquees, counters render final values immediately.

## WebGL — three signature moments

The homepage hero has no WebGL. The showreel is a plain DOM `<video>`, which is both the
correct LCP element and simpler than a video texture.

1. **`/work` index — the Constellation.** The existing Multiverse, relocated. An index of
   all work as screens flown through, with the DOM list alongside. On the index rather
   than the front door, it costs the homepage's first paint nothing.
2. **Capabilities — VFX proof.** When the VFX & CGI offer is active, a *contained* canvas
   fills the sticky panel. Not full-bleed. Proof of the service, inside the service.
3. **Contact — the pull-back.** Camera retreats to reveal the full constellation,
   reusing moment 1's scene.

**Reused from the v1 WebGL layer:** `lib/prng.ts`, `lib/webgl-content.ts`,
`lib/camera-path.ts`, `lib/webgl-capability.ts`, and the `Screen`, `ParticleField`,
`Effects`, `CameraRig`, `Multiverse`, `WebGLCanvas` components.

**Retired:** `components/webgl/HeroReel.tsx`, along with its video-texture path.

Tier gating (`off` / `low` / `high`) is unchanged from v1 and continues to govern all
three moments.

## Component architecture

```
app/
  page.tsx                   home
  work/page.tsx              index + constellation
  work/[slug]/page.tsx       case study — generateStaticParams + generateMetadata
  not-found.tsx              404 in the new language
  api/contact/route.ts       unchanged
components/
  chrome/  Timecode · FrameMarks · Scrubber · CursorReadout · Transition
  home/    Hero · SelectedWork · Capabilities · Proof · PointOfView · Clients
  work/    CaseStudyHero · TrackStack · MetricLedger · MediaBlock · NextCase
  webgl/   rescoped
```

Three components evolve rather than being rewritten: `Capabilities` from v1's
`ServicesPinned`, `Proof` from `StatCounter`, `Scrubber` from `ScrollProgress`.

## Data flow

Content is static TypeScript throughout; there is no CMS and no runtime content fetching.
Case-study routes are statically generated via `generateStaticParams`.

**Scroll is read exactly once.** `ScrollProgressProvider` becomes the single
rAF-throttled source, publishing `{ page, section, hero }`. The scrubber, hero type axis,
and camera rig all consume it. This resolves a defect carried from v1, where the provider
was mounted but had no consumers while `Hero` and `CameraRig` each ran independent scroll
listeners performing redundant `getBoundingClientRect()` work every frame.

## Error handling

- **Unknown case-study slug** → `notFound()` → styled 404.
- **Video load failure** → poster image holds; never a broken frame.
- **No WebGL / reduced motion / low tier** → existing `pickTier` gate; the constellation
  degrades to the DOM work grid, which is already the real crawlable content.
- **Font loading** → `display: swap` with a metric-matched fallback; the swap must not
  shift layout.
- **Contact API** → unchanged from v1: zod validation, Resend delivery, and the existing
  soft path that accepts and logs submissions when `RESEND_API_KEY` is absent.

## Testing

Vitest, extending v1's pure-logic discipline. three.js stays out of unit tests.

| Unit | Assertions |
|---|---|
| `lib/content/work.ts` | slug lookup, slug uniqueness, flagship/index partition |
| `lib/timecode.ts` *(new)* | progress → `HH:MM:SS:FF` formatting, boundaries |
| `lib/type-axis.ts` *(new)* | scroll → font axis mapping, clamped at both ends |
| `lib/content/capabilities.ts` | all 9 services group into offers, none dropped |
| existing 15 tests | pass unchanged |

## Build prerequisite

The repository cannot currently build on Node 18 — Next 16 requires ≥20.9.0, and Vitest 4
requires `node:util.styleText`. Neither `.nvmrc` nor an `engines` field exists, so the
default toolchain fails on both `npm run build` and `npm test`. Adding both is the first
implementation task, ahead of any redesign work.

## Sequencing

The plan must keep the site deployable at every stage rather than broken across a long
migration:

1. **Foundations** — Node pinning, palette, type system, content module split
2. **Home** — new sequence, sections 01–07
3. **Case studies** — `/work` and `/work/[slug]`, redirect from `/portfolio`
4. **WebGL moments** — relocate the constellation, VFX proof, pull-back
5. **Chrome & polish** — scrubber, cut transitions, cursor readout, framing marks

## Success criteria

- Home and case-study routes render the new language; `/portfolio` redirects to `/work`.
- At least three flagship case studies live at `/work/[slug]` with real content.
- Zero cumulative layout shift from the hero type animation or font swap.
- Homepage LCP is the showreel poster or hero type — never a WebGL frame.
- `prefers-reduced-motion` and no-WebGL paths render a clean, complete site.
- All content crawlable; no regression to SEO or the contact flow.
- `next build` clean on Node ≥20.9; full vitest suite green.

## Out of scope

- CMS, blog, multilingual, analytics dashboards.
- Kinetic type beyond the hero headline.
- A second accent colour, or Cutting Room furniture beyond the five listed elements.
- Gaussian splats, baked cameras, WebGPU, audio.
- Rebuilding the homepage as one continuous WebGL scene.
