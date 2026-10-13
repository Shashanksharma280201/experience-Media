# Charcoal, One Blue, and "The Frame" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the site to the brief's colour system (cool near-white, charcoal, one electric blue, no tints), rebuild the hero as full-viewport footage with the headline over it, and give every text-only home section a piece of media.

**Architecture:** Colour is a token swap plus the deletion of the four tint scenes; `Scene` keeps one dark tone that renders through the existing `.scene-ground` layer so `Depth.tsx` keeps drawing grounds in. The hero keeps its sticky track and curtain and reverses the takeover: footage first, page rising over it. Media is named in one content file (`lib/content/media.ts`) and every section reads from it, so a test can prove every referenced file exists.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 `@theme` tokens, GSAP 3 + ScrollTrigger + SplitText, Lenis, next/image, vitest, Playwright (headless shell at `~/.cache/ms-playwright/chromium_headless_shell-1208/...`), ffmpeg, ImageMagick.

**Spec:** `docs/superpowers/specs/2026-10-13-charcoal-blue-and-the-frame-design.md`

## Global Constraints

- Node 24 only: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH` before every npm/npx/node command. The shell defaults to Node 18, which Next rejects.
- Do not commit or push. The user commits and pushes on request. Each task ends with a verification step and `git add` of its files, nothing more.
- Token values, verbatim from the spec: paper `#f5f6f7`, ink `#15171a`, ink-dim `rgba(21,23,26,0.72)`, ink-faint `rgba(21,23,26,0.65)`, hairline `rgba(21,23,26,0.14)`, paper-deep `#e8eaed`, signal `#1f3dff`, signal-band `#5c74ff`.
- The tints `--color-sun|mint|sky|rose` and the old red `#ff2d20` must not appear anywhere in `app/globals.css` after Task 1.
- The accent appears only as: the script word, the band's script and hover fill, the loader's "Media", focus ring, scroll cue, current-page marker, selection. No accent buttons, rules, or running copy.
- No piece counts anywhere (brief §13). No copy changes: copy is as the brief set it.
- Every `<video>` is `muted loop playsInline preload="none"` with a `poster`, started only when in view. Every image is `next/image` with `sizes`.
- Reduced motion: every new animation is behind `prefersReducedMotion()`; the hero becomes one still viewport.
- The roster block inside `components/home/Clients.tsx` (everything from `<div ref={roster}` down) is not touched.
- Accessibility gate: `PORT=3123 node scripts/audit.mjs` must report `violations: 0  overflow: 0`.
- Temporary Playwright probes live at `scripts/_*.tmp.mjs`, launch with `executablePath` set to the headless shell above and `--disable-gpu`, and are deleted at the end of the task that made them. Scratch files go under `/tmp/claude-1000/-home-shanks-Music--shanks-parth-website/95973415-386d-496e-8a48-428b3f2f6ad3/scratchpad/`.
- Kill the test server by port, never by process-name pattern: `ss -ltnp | grep -E ':3123 ' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u | xargs -r kill`.

## Review Focus

1. **A bright showreel frame under the headline.** Paper type over a white-ish shot with only the 0.5 scrim is 3.2:1. Task 3 measures the poster frame's luminance under the headline box and fails under 4.5:1; Task 4's probe re-measures on the rendered hero.
2. **Reduced motion with autoplay video.** A visitor with `prefers-reduced-motion: reduce` must get a still poster, no `play()`, and no sticky track. Task 4 tests this with `page.emulateMedia({ reducedMotion: "reduce" })`.
3. **The founder asset missing at build time.** `public/assets/founder/` may be empty when this ships. Task 6 renders a labelled paper slot and the media test treats the founder path as optional; nothing 404s.
4. **The loader handoff over footage.** The video must already be playing when the panel lifts, and no finished hero may show under the wipe (the bug fixed on 2026-09-14). Task 4's probe samples the hero every 100ms from 2.2s to 4.6s and asserts the headline chars are masked until the handoff and `video.paused === false` at 3.0s.
5. **Phone layout with four headline lines over footage.** At 390×844 the headline, links, strip and Watch button must all fit above the fold with 16px gutters and no overflow. Task 4 screenshots 390 and asserts the strip's bottom is above `innerHeight`.

---

### Task 1: Tokens, the band, and the end of the tints

**Files:**
- Modify: `app/globals.css` (lines 1–22 `@theme`; the `.scene--sun|mint|sky|rose` rules around 240–380; `.redblock` block around 1077–1108; `.stack-card` around 1368; the three `.scene--* .num` rules)
- Modify: `components/layout/Scene.tsx`
- Modify: `components/motion/Depth.tsx` (comment only)
- Create: `app/globals.test.ts`

**Interfaces:**
- Produces: `Scene` prop `tone?: "paper" | "dark"`; CSS classes `.scene--dark`, `.band` (replaces `.redblock`); tokens `--color-signal-band`, `--color-paper-dim`, `--color-paper-faint`, `--color-hairline-dark`.

- [ ] **Step 1: Write the failing token test**

```ts
// app/globals.test.ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

describe("colour tokens", () => {
  it("sets the v4 palette", () => {
    expect(css).toMatch(/--color-paper:\s*#f5f6f7/i);
    expect(css).toMatch(/--color-ink:\s*#15171a/i);
    expect(css).toMatch(/--color-signal:\s*#1f3dff/i);
    expect(css).toMatch(/--color-signal-band:\s*#5c74ff/i);
    expect(css).toMatch(/--color-ink-faint:\s*rgba\(21,\s*23,\s*26,\s*0\.65\)/);
  });

  it("has no tints and no red left", () => {
    expect(css).not.toMatch(/--color-(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/scene--(sun|mint|sky|rose)/);
    expect(css).not.toMatch(/#ff2d20/i);
    expect(css).not.toMatch(/\.redblock/);
  });

  it("styles the band through the inverted tokens", () => {
    expect(css).toMatch(/\.band\s*\{[^}]*background:\s*var\(--color-ink\)/);
    expect(css).toMatch(/\.band \.poster-script[^{]*\{[^}]*color:\s*var\(--color-signal-band\)/);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; npx vitest run app/globals.test.ts`
Expected: FAIL on every assertion in the first and third tests; the second fails on the tints.

- [ ] **Step 3: Replace the `@theme` colour tokens**

In `app/globals.css`, replace the colour lines of the `@theme` block (from `--color-paper` to `--color-rose`) with:

```css
  --color-paper: #f5f6f7;
  --color-ink: #15171a;
  /* Alpha ramp is set by contrast, not by eye: against --paper these give
     6.9:1 and 5.4:1, so both clear AA for normal-size text. */
  --color-ink-dim: rgba(21, 23, 26, 0.72);
  --color-ink-faint: rgba(21, 23, 26, 0.65);
  --color-hairline: rgba(21, 23, 26, 0.14);
  /* Media placeholder — the one tone allowed to sit under a thumbnail. */
  --color-paper-deep: #e8eaed;
  /* The accent. 6.1:1 on paper. */
  --color-signal: #1f3dff;
  /* The same blue two steps lighter, for the band: 4.6:1 on ink, where
     the accent itself is 2.7:1 and fails. */
  --color-signal-band: #5c74ff;
  /* The band's type: paper, inverted through the same ramp (9.0:1, 6.6:1). */
  --color-paper-dim: rgba(245, 246, 247, 0.72);
  --color-paper-faint: rgba(245, 246, 247, 0.6);
  --color-hairline-dark: rgba(245, 246, 247, 0.16);
```

Update the comment above the block to `Tokens — see DESIGN.md. Cool near-white, charcoal ink, one blue.`

- [ ] **Step 4: Delete every tint rule and add the dark scene**

Remove, in full: `.scene--sun, .scene--mint, .scene--sky, .scene--rose { background: transparent; }`; both `.scene--sun .poster-script, ... .scene--rose .poster-script { ... }` blocks; the `@media (max-width: 767px)` block that restyles those scripts; and the `.scene--sun .text-ink-faint, ... .scene--rose .num { color: var(--color-ink-dim); }` block. Grep `scene--sun` afterwards: zero hits.

Directly after `.scene--signal { ... }` (which you also delete), add:

```css
/* The dark band is a layer under the scene, like the tints were, so the
   page can draw it in as the scene arrives (motion #12). Type inverts
   through the paper ramp; the accent steps up to its band value. */
.scene--dark {
  background: transparent;
  color: var(--color-paper);
}
.scene--dark .scene-ground {
  background: var(--color-ink);
}
.scene--dark .poster-script,
.band .poster-script {
  color: var(--color-signal-band);
}
.scene--dark .text-ink-dim,
.scene--dark .lede,
.band .text-ink-dim,
.band .lede {
  color: var(--color-paper-dim);
}
.scene--dark .text-ink-faint,
.scene--dark .num,
.scene--dark .micro,
.scene--dark .small,
.band .text-ink-faint,
.band .num,
.band .micro {
  color: var(--color-paper-faint);
}
.scene--dark .border-hairline,
.scene--dark .bg-hairline,
.band .border-hairline {
  border-color: var(--color-hairline-dark);
  background-color: var(--color-hairline-dark);
}
.scene--dark .text-ink,
.band .text-ink {
  color: var(--color-paper);
}
```

Check the old `.scene-ground` rule still reads `position: absolute; inset: 0; z-index: -1;` and that the four `.scene--sun .scene-ground { background: var(--color-sun) }`-style rules, if present, are deleted too (grep `scene-ground`).

- [ ] **Step 5: Rename `.redblock` to `.band` and invert it**

Replace the whole `.redblock` block (from `.redblock {` through `.redblock :focus-visible { ... }`) with:

```css
/* The band. Charcoal, paper type, the accent only in its script and the
   button's hover fill. The contact scene, the footer and About's statement. */
.band {
  background: var(--color-ink);
  color: var(--color-paper);
}
.band .field {
  color: var(--color-paper);
  border-bottom-color: var(--color-paper-faint);
}
.band .field:focus {
  border-bottom-color: var(--color-paper);
}
.band .button {
  border-color: var(--color-paper);
  color: var(--color-paper);
}
.band .button:hover,
.band .button:focus-visible {
  background: var(--color-paper);
  color: var(--color-ink);
}
.band .link-underline::after {
  background: currentColor;
}
.band ::selection {
  background: var(--color-signal-band);
  color: var(--color-ink);
}
.band :focus-visible {
  outline-color: var(--color-signal-band);
}
.band select option {
  color: var(--color-ink);
}
```

Then `grep -n "redblock" app/globals.css` must return nothing. Also change `.stack-card`'s `background: var(--color-paper); border: 1px solid var(--color-hairline);` to stay as is (the cards are paper on the dark process scene; that is intended) and add `color: var(--color-ink);` to it so the card's type does not inherit the scene's paper.

Do the same for `.deck-card`: add `color: var(--color-ink);` is already there; confirm `.deck-text` and `.deck-foot` keep ink tones because they use `--color-ink-dim` directly, not the `.text-ink-dim` class. The deck's `.deck-quote` and `.deck-stars` use `--color-signal`; on a paper card that is correct and stays.

- [ ] **Step 6: Narrow `Scene`'s tone**

Replace `components/layout/Scene.tsx` with:

```tsx
import Shell from "./Shell";

/**
 * One act per section. A scene is at least a viewport tall and centres one
 * thing. `tone` switches the paper for the dark band; `tight` drops the
 * viewport minimum for list scenes. The band is its own layer so the page
 * can draw it in on scroll (motion #12).
 */
export default function Scene({
  id,
  children,
  className = "",
  tone = "paper",
  tight = false,
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "dark";
  tight?: boolean;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scene ${tone === "dark" ? "scene--dark" : ""} ${tight ? "scene--tight" : ""} ${className}`}
    >
      {tone === "dark" && <div className="scene-ground" aria-hidden />}
      {bleed ? <div className="scene-body">{children}</div> : <Shell className="scene-body">{children}</Shell>}
    </section>
  );
}
```

In `components/motion/Depth.tsx` change the comment line `A tinted scene's ground draws down over the paper` to `A dark scene's ground draws down over the paper`. No code change: it already targets `.scene-ground`.

- [ ] **Step 7: Run the token test and the type check**

Run: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; npx vitest run app/globals.test.ts && npx tsc --noEmit`
Expected: the test PASSES. `tsc` FAILS in the eight files that still pass `tone="sun"` etc. That is Task 2's job; note the list and move on.

- [ ] **Step 8: Stage**

```bash
git add app/globals.css app/globals.test.ts components/layout/Scene.tsx components/motion/Depth.tsx
```

---

### Task 2: Every scene on paper or dark, every band charcoal

**Files:**
- Modify: `components/home/Positioning.tsx` (`tone="sun"` → none)
- Modify: `components/home/Record.tsx` (`tone="mint"` → `tone="dark"`)
- Modify: `components/home/Process.tsx` (`tone="sky"` → `tone="dark"`)
- Modify: `components/home/Testimonials.tsx` (`tone="rose"` → `tone="dark"`)
- Modify: `components/home/Training.tsx` (`tone="sun"` → none)
- Modify: `components/home/Contact.tsx` (`tone="signal" className="redblock"` → `tone="dark" className="band"`)
- Modify: `components/Footer.tsx` (`redblock` → `band`; the inline `borderColor: "rgba(10,10,11,0.35)"` → `var(--color-hairline-dark)`)
- Modify: `app/about/page.tsx` (`tone="sky"` → `tone="dark"`; `tone="signal" className="redblock"` → `tone="dark" className="band"`)
- Modify: `app/training/page.tsx` (`tone="sun"` → none)
- Modify: `DESIGN.md` §1 Colour and §3 The scene

**Interfaces:**
- Consumes: `Scene` `tone: "paper" | "dark"`, `.band` from Task 1.

- [ ] **Step 1: Make the edits**

Run this once from the project root; it is exact string replacement and will error on any miss:

```bash
python3 - <<'PY'
import re
edits = {
 "components/home/Positioning.tsx": [('<Scene id="studio" tone="sun">', '<Scene id="studio">')],
 "components/home/Record.tsx": [('<Scene tone="mint">', '<Scene tone="dark">')],
 "components/home/Process.tsx": [('<Scene tone="sky" tight>', '<Scene tone="dark" tight>')],
 "components/home/Testimonials.tsx": [('<Scene tone="rose">', '<Scene tone="dark">')],
 "components/home/Training.tsx": [('<Scene id="training" tone="sun" tight>', '<Scene id="training" tight>')],
 "components/home/Contact.tsx": [('<Scene id="contact" tone="signal" className="redblock" tight={page}>', '<Scene id="contact" tone="dark" className="band" tight={page}>')],
 "components/Footer.tsx": [('className="redblock relative overflow-hidden pt-[var(--section-y)]"', 'className="band relative overflow-hidden pt-[var(--section-y)]"'),
                           ('style={{ borderColor: "rgba(10,10,11,0.35)" }}', 'style={{ borderColor: "var(--color-hairline-dark)" }}')],
 "app/about/page.tsx": [('<Scene tone="sky" tight>', '<Scene tone="dark" tight>'), ('<Scene tone="signal" className="redblock" tight>', '<Scene tone="dark" className="band" tight>')],
 "app/training/page.tsx": [('<Scene tone="sun" tight>', '<Scene tight>')],
}
for p, reps in edits.items():
    s = open(p).read()
    for a, b in reps:
        assert a in s, f"{p}: {a!r} not found"
        s = s.replace(a, b)
    open(p, "w").write(s)
print("ok")
PY
```

- [ ] **Step 2: Type-check and grep**

Run: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; npx tsc --noEmit && grep -rn 'tone="sun"\|tone="mint"\|tone="sky"\|tone="rose"\|tone="signal"\|redblock' components app`
Expected: tsc clean; grep prints nothing.

- [ ] **Step 3: Rewrite DESIGN.md §1 Colour**

Replace everything from `## 1. Colour` to the line before `## 2. Typography` with:

```markdown
## 1. Colour

Cool near-white, charcoal ink, one blue. Eight tokens, one of them the blue's band step.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F5F6F7` | Ground. The only light background on the site. A hair of blue, never pure white. |
| `--ink` | `#15171A` | Type, and the ground of the band. |
| `--ink-dim` | `rgba(21,23,26,0.72)` | Body prose. 6.9:1 on paper. |
| `--ink-faint` | `rgba(21,23,26,0.65)` | Labels, numerals. 5.4:1, the floor for normal text. |
| `--hairline` | `rgba(21,23,26,0.14)` | 1px rules. The only border colour on paper. |
| `--paper-deep` | `#E8EAED` | Media placeholder, under thumbnails only. |
| `--signal` | `#1F3DFF` | **The accent.** 6.1:1 on paper. |
| `--signal-band` | `#5C74FF` | The accent on the band, two steps lighter: 4.6:1 on ink, where `--signal` is 2.7:1. The way a dark mode lifts its accent, not a second colour. |

On the band the type ramp inverts: paper, `--paper-dim` (0.72, 9.0:1), `--paper-faint` (0.60, 6.6:1), `--hairline-dark` (0.16).

The alpha ramp is set by measured contrast, not by eye; `npm run audit` checks it on every route and `app/globals.test.ts` pins the values.

### Where the accent is allowed to appear

1. **The script** — one word in Pinyon Script laid across a poster headline. Never a whole sentence. On the band it is `--signal-band`.
2. **The band's hover** — the button on the band fills paper, not blue; the accent on the band is the script and the selection only.
3. **The loading screen's script** — the wordmark's "Media".
4. **Focus ring**, **scroll cue**, **current-page marker**, **selection**.

Forbidden: blue words inside running copy, blue buttons, blue rules, glows,
gradients, and any second hue. The tints of v3 are retired: colour comes from the
work now.

### The band

The charcoal scenes: the numbers, the process, the voices, About's question, the
contact band, About's statement, the footer. A dark scene is a `.scene-ground`
layer under the scene so it draws in on scroll like the tints did; the contact
band and the footer are solid (`.band`) because that is where the site stops
performing.

### The mark

The emblem (`components/brand/Emblem.tsx`) appears beside the wordmark in the nav,
above the wordmark in the loader, and in the footer's band. It inherits the text
colour: ink on paper, paper on the band.

### Deliberately not doing

No secondary accent. No greys beyond the three alpha steps of ink. Client logos
render flat ink at 60%, full on hover.

---
```

In §3 The scene, change the sentence that names the tints to: `A scene is paper or dark; the dark ground draws in on scroll (motion #12).` (find it with `grep -n "sun\|mint\|rose" DESIGN.md` and fix every hit in §3–§5, including motion row 12's wording and the home sections line: "05 the numbers (dark)", "10 process (dark)", "12 what people say (dark)", "15 the conversation (band)", "footer (band)").

- [ ] **Step 4: Build, run the audit, look**

```bash
export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH
npm run lint && npm test && npm run build
(nohup npx next start -p 3123 > /tmp/claude-1000/next3123.log 2>&1 &); sleep 3
PORT=3123 node scripts/audit.mjs | tail -3
```
Expected: `violations: 0  overflow: 0`. If the audit flags `.num` or `.small` on a dark scene, the inverted selectors in Task 1 Step 4 missed that class: add it to the `.scene--dark` faint list.

Then screenshot the numbers, process, voices and contact scenes at 1440 with a probe like the one in Task 4 Step 9 and confirm: paper type on charcoal, paper cards on the process and deck scenes, a blue script on the band, no pastel anywhere. Kill the server by port.

- [ ] **Step 5: Stage**

```bash
git add components/home components/Footer.tsx app/about/page.tsx app/training/page.tsx DESIGN.md
```

---

### Task 3: The assets and `lib/content/media.ts`

**Files:**
- Create: `scripts/encode-media.sh`
- Create: `public/assets/webgl/hero-loop.mp4`, `hero-loop-720.mp4`, `hero-poster.jpg` (replacing the current 12s cut)
- Create: `public/assets/clips/bts.mp4`, `bts-poster.jpg`
- Create: `lib/content/media.ts`, `lib/content/founder-media.ts`, `lib/content/media.test.ts`
- Modify: `lib/content/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export const clips: { hero: Clip; heroSmall: Clip; bts: Clip };   // Clip = { src: string; poster: string }
  // in lib/content/founder-media.ts, server-only (reads the disk), never in the barrel:
  export const founderMedia: { image: string; video?: string } | null; // null until the client's file exists
  export const audienceFrames: Record<"business-owners" | "content-creators" | "brands", string>;
  export const processFrames: string[];        // four, one per step, in process order
  export const capabilityFrames: string[];     // five, cycled between the words
  export const numbersWall: string[];          // eighteen thumbs, 6×3
  ```

- [ ] **Step 1: Write the failing media test**

```ts
// lib/content/media.test.ts
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { audienceFrames, capabilityFrames, clips, numbersWall, processFrames } from "./media";
import { founderMedia } from "./founder-media";

const onDisk = (p: string) => existsSync(join(process.cwd(), "public", p));

describe("media", () => {
  it("points every clip and poster at a file on disk", () => {
    for (const c of Object.values(clips)) {
      expect(onDisk(c.src), c.src).toBe(true);
      expect(onDisk(c.poster), c.poster).toBe(true);
    }
  });

  it("points every frame at a file on disk", () => {
    for (const p of [...Object.values(audienceFrames), ...processFrames, ...capabilityFrames, ...numbersWall]) {
      expect(onDisk(p), p).toBe(true);
    }
  });

  it("sizes the fixed sets", () => {
    expect(processFrames).toHaveLength(4);
    expect(capabilityFrames).toHaveLength(5);
    expect(numbersWall).toHaveLength(18);
    expect(new Set(numbersWall).size).toBe(18);
  });

  it("treats the founder asset as optional, never as a stock stand-in", () => {
    if (founderMedia) {
      expect(founderMedia.image).toMatch(/^\/assets\/founder\//);
      expect(onDisk(founderMedia.image)).toBe(true);
    } else {
      expect(founderMedia).toBeNull();
    }
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; npx vitest run lib/content/media.test.ts`
Expected: FAIL, "Cannot find module './media'".

- [ ] **Step 3: Write the encode script**

```bash
# scripts/encode-media.sh — the hero cut, its phone cut and poster, and the BTS loop.
# Run from the project root. Needs ffmpeg and ImageMagick.
set -euo pipefail
SRC=public/assets/experience-media-show-reel.mp4
OUT=public/assets/webgl
CLIPS=public/assets/clips
mkdir -p "$OUT" "$CLIPS"

# The hero: six of the reel's strongest shots, ~1.2s each, crossfaded, darkened
# and desaturated so paper type sits on it. In-points in seconds.
FILTER="[0:v]trim=0.5:1.7,setpts=PTS-STARTPTS[a];
[0:v]trim=2.2:3.4,setpts=PTS-STARTPTS[b];
[0:v]trim=10.5:11.7,setpts=PTS-STARTPTS[c];
[0:v]trim=16:17.2,setpts=PTS-STARTPTS[d];
[0:v]trim=20:21.2,setpts=PTS-STARTPTS[e];
[0:v]trim=24:25.2,setpts=PTS-STARTPTS[f];
[a][b]xfade=transition=fade:duration=0.25:offset=0.95[ab];
[ab][c]xfade=transition=fade:duration=0.25:offset=1.9[abc];
[abc][d]xfade=transition=fade:duration=0.25:offset=2.85[abcd];
[abcd][e]xfade=transition=fade:duration=0.25:offset=3.8[abcde];
[abcde][f]xfade=transition=fade:duration=0.25:offset=4.75[cut];
[cut]eq=brightness=-0.08:saturation=0.85:contrast=1.05,fps=30[graded]"

ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER;[graded]scale=1920:1080[v1080]" -map "[v1080]" -an \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop.mp4"
ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER;[graded]scale=1280:720[v720]" -map "[v720]" -an \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop-720.mp4"
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

# Behind the scenes: the reel's 9–14s passage, silent, 720p, for the belief and the offer.
ffmpeg -v error -y -ss 9 -t 5 -i "$SRC" -an -vf "scale=1280:720,fps=30" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$CLIPS/bts.mp4"
ffmpeg -v error -y -i "$CLIPS/bts.mp4" -frames:v 1 -q:v 4 "$CLIPS/bts-poster.jpg"

# Contrast gate: mean luminance of the poster under the headline box
# (left 4%–60%, top 45%–88% of the frame). Paper on it must clear 4.5:1.
MEAN=$(convert "$OUT/hero-poster.jpg" -crop 56%x43%+4%+45% -colorspace Gray -format "%[fx:mean]" info:)
python3 - "$MEAN" <<'PY'
import sys
m=float(sys.argv[1])
# After the 0.5 ink scrim: 0.5*m + 0.5*lum(ink≈0.008)
l=0.5*m+0.5*0.008
paper=0.93
ratio=(paper+0.05)/(l+0.05)
print(f"poster mean {m:.3f}, under scrim {l:.3f}, paper contrast {ratio:.2f}:1")
sys.exit(0 if ratio>=4.5 else 1)
PY
ls -la "$OUT" "$CLIPS"
```

Make it executable: `chmod +x scripts/encode-media.sh`.

- [ ] **Step 4: Run the encode**

Run: `./scripts/encode-media.sh`
Expected: four files in `webgl/`, two in `clips/`, and a final line like `poster mean 0.21, under scrim 0.11, paper contrast 6.1:1`. If the contrast gate fails, lower `brightness` to `-0.12` in the `eq` filter and re-run; do not lower the scrim.

Then `ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 public/assets/webgl/hero-loop.mp4` → about `6.0` seconds, `1920,1080`.

- [ ] **Step 5: Write `lib/content/media.ts`**

```ts
// lib/content/media.ts — every clip and frame the home page places beside
// its copy, named in one place so a test can prove each file exists.
// Plain data only: this file is imported by client components through the
// content barrel, so it must never touch the filesystem.
// The work frames are picked by piece id so a reorder of the portfolio
// never changes what a section shows.
import { disciplines, featured, pieceId, rest } from "./work";

export type Clip = { src: string; poster: string };

export const clips = {
  hero: { src: "/assets/webgl/hero-loop.mp4", poster: "/assets/webgl/hero-poster.jpg" },
  heroSmall: { src: "/assets/webgl/hero-loop-720.mp4", poster: "/assets/webgl/hero-poster.jpg" },
  /** The reel's behind-the-scenes passage, 9–14 s. */
  bts: { src: "/assets/clips/bts.mp4", poster: "/assets/clips/bts-poster.jpg" },
} satisfies Record<string, Clip>;

const all = [...featured.map((f) => ({ id: pieceId(f.href), thumb: f.thumb })), ...rest.map((r) => ({ id: pieceId(r.href), thumb: r.thumb }))];
const byId = (id: string): string => {
  const hit = all.find((p) => p.id === id);
  if (!hit) throw new Error(`media: no piece ${id}`);
  return hit.thumb;
};
const firstOf = (slug: string): string => {
  const d = disciplines.find((x) => x.slug === slug);
  if (!d) throw new Error(`media: no discipline ${slug}`);
  return d.items[0].thumb;
};

/** One frame per audience: a founder on camera, a creator's Short, a brand film. */
export const audienceFrames = {
  "business-owners": byId("8nES01011GY"),
  "content-creators": byId("oK1jMtrgQU4"),
  brands: byId("4mX9fkeQFHQ"),
} as const;

/** One per process step: discover (podcast), strategise (long-form), produce (VFX), grow (short-form). */
export const processFrames = [firstOf("podcast"), firstOf("long-form"), firstOf("vfx-cgi"), firstOf("short-format")];

/** Cycled between the words of the capabilities band. */
export const capabilityFrames = [byId("4mX9fkeQFHQ"), byId("xIncgA51Sks"), byId("gzb4m1xQEiQ"), byId("6pPNOvofdWs"), byId("-DBx9Ss1C-g")];

/** The faint wall behind the numbers: 6×3, landscape pieces first. */
export const numbersWall = [...featured.filter((f) => f.orientation === "landscape"), ...rest.filter((r) => r.discipline.layout === "long")]
  .map((p) => p.thumb)
  .filter((t, i, a) => a.indexOf(t) === i)
  .slice(0, 18);
```

And the server-only file:

```ts
// lib/content/founder-media.ts — server-only. The client supplies
// `public/assets/founder/parth.jpg` (and optionally `parth.mp4`); until
// then the founder sections render a labelled slot. Resolved at build
// time, so a missing file is a slot, never a 404. Not exported from the
// content barrel: it reads the disk, and the barrel reaches client bundles.
import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "assets", "founder");

export const founderMedia: { image: string; video?: string } | null = existsSync(join(dir, "parth.jpg"))
  ? { image: "/assets/founder/parth.jpg", ...(existsSync(join(dir, "parth.mp4")) ? { video: "/assets/founder/parth.mp4" } : {}) }
  : null;
```

`server-only` is a package: `npm i server-only` (it is a tiny marker that makes a client import fail at build time with a clear message). vitest runs in node, so the test can import `founder-media.ts` directly; add `"server-only": { "resolve": ... }` nothing: vitest resolves the package to its server build, which is a no-op. If vitest errors on `server-only`, add to `vitest.config.ts` `resolve.alias["server-only"] = path.resolve(import.meta.dirname, "test/server-only.ts")` with that file containing a single `export {};`.

Check the discipline slugs with `grep -n 'slug:' lib/content/work.ts`; they are `short-format`, `long-form`, `podcast`, `motion-graphics`, `vfx-cgi`. If the podcast slug differs, use the one printed.

Add to `lib/content/index.ts`:

```ts
export { clips, audienceFrames, processFrames, capabilityFrames, numbersWall, type Clip } from "./media";
```

Rule for later tasks: client components import `clips`, `audienceFrames`, `processFrames`, `capabilityFrames`, `numbersWall` from `@/lib/content`; `founderMedia` is imported from `@/lib/content/founder-media` only, and only by server components (`FounderFrame.tsx` in Task 6).

- [ ] **Step 6: Run the media test and the whole suite**

Run: `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; npm test`
Expected: all pass, including the new four. (With no founder file, the optional test passes on the `null` branch.)

- [ ] **Step 7: Stage**

```bash
git add scripts/encode-media.sh public/assets/webgl public/assets/clips lib/content/media.ts lib/content/founder-media.ts lib/content/media.test.ts lib/content/index.ts package.json package-lock.json
```

---

### Task 4: The hero, "the frame"

**Files:**
- Modify: `components/home/Hero.tsx` (full rewrite)
- Modify: `app/globals.css` (the hero block, roughly lines 746–927: everything from `/* ---- The hero` through `.hero-tag` media query)
- Modify: `app/page.tsx` (drop the `Ticker` under the hero and its `credibility` import)
- Modify: `lib/content/site.ts` (`showreel`, `showreelSmall`, `showreelPoster` now point at the same files; keep the keys, values unchanged, so `Reel.tsx` and `ReelPlayer.tsx` are untouched)
- Create then delete: `scripts/_hero.tmp.mjs`
- Modify: `DESIGN.md` motion row 17 and the hero line in §4

**Interfaces:**
- Consumes: `clips.hero`, `clips.heroSmall` from Task 3; `credibility` from `lib/content/proof.ts`; `openReel` from `lib/reel.ts`; `whenIntroDone`, `prefersReducedMotion` from `lib/gsap.ts`; `ImageTrail`, `Magnet`, `Poster`, `Group`, `Shell` as today.
- Produces: `.hero-track`, `.hero`, `.hero-film`, `.hero-scrim`, `.hero-copy`, `.hero-strip`, `.hero-watch`, CSS vars `--hero-open`, `--hero-curtain` (unchanged).

- [ ] **Step 1: Write the probe that will prove the hero**

```js
// scripts/_hero.tmp.mjs — samples the hero across the loader handoff, checks
// reduced motion, the phone fold, and the type's contrast on the footage.
import { chromium } from "playwright";
const CHROME = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell";
const OUT = process.env.OUT;
const browser = await chromium.launch({ args: ["--disable-gpu"], executablePath: CHROME });
const fails = [];

// 1. Handoff: no finished hero under the wipe, footage playing at handoff.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const t0 = Date.now();
  await page.goto("http://localhost:3123/", { waitUntil: "domcontentloaded" });
  const rows = [];
  for (let t = 2200; t <= 4600; t += 200) {
    const wait = t0 + t - Date.now(); if (wait > 0) await page.waitForTimeout(wait);
    rows.push({ t, ...(await page.evaluate(() => {
      const v = document.querySelector(".hero-film video");
      const ch = document.querySelector(".hero-poster .split-parent div div");
      return { intro: !!document.querySelector(".intro"), done: document.documentElement.classList.contains("intro-done"), playing: !!v && !v.paused && v.currentTime > 0, charY: ch ? getComputedStyle(ch).transform : "-", copyOp: getComputedStyle(document.querySelector(".hero-copy")).opacity };
    })) });
  }
  console.table(rows);
  const under = rows.filter((r) => r.intro && !r.done);
  if (under.some((r) => r.charY === "none")) fails.push("headline unmasked under the loader");
  const at3 = rows.find((r) => r.t === 3000);
  if (!at3?.playing) fails.push("footage not playing at 3.0s");
  await page.screenshot({ path: `${OUT}/hero-1440.png` });
  // Contrast of paper type over the footage: sample the headline box.
  const box = await page.evaluate(() => { const r = document.querySelector(".hero-poster").getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await page.evaluate(() => { document.querySelector(".hero-copy").style.visibility = "hidden"; });
  await page.screenshot({ path: `${OUT}/hero-bg.png`, clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
  await page.close();
}
// 2. Reduced motion: still poster, no play, no track.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3123/", { waitUntil: "load" });
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => { const v = document.querySelector(".hero-film video"); const track = document.querySelector(".hero-track"); return { video: !!v, paused: v ? v.paused : true, trackH: track.getBoundingClientRect().height, innerH: innerHeight }; });
  if (r.video && !r.paused) fails.push("video plays under reduced motion");
  if (r.trackH > r.innerH * 1.05) fails.push(`track is ${r.trackH}px under reduced motion`);
  await page.close();
}
// 3. Phone fold.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3123/", { waitUntil: "load" });
  await page.keyboard.press("Escape"); await page.waitForTimeout(2500);
  const r = await page.evaluate(() => { const s = document.querySelector(".hero-strip").getBoundingClientRect(); const w = document.querySelector(".hero-watch").getBoundingClientRect(); return { stripBottom: s.bottom, watchBottom: w.bottom, innerH: innerHeight, scrollW: document.documentElement.scrollWidth }; });
  if (r.stripBottom > r.innerH || r.watchBottom > r.innerH) fails.push(`phone: strip ${r.stripBottom} watch ${r.watchBottom} vs ${r.innerH}`);
  if (r.scrollW > 390) fails.push("phone: horizontal overflow");
  await page.screenshot({ path: `${OUT}/hero-390.png` });
  await page.close();
}
// 4. Scroll: after one viewport the film is a card and the copy is gone.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3123/", { waitUntil: "load" });
  await page.keyboard.press("Escape"); await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, innerHeight)); await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({ clip: getComputedStyle(document.querySelector(".hero-film")).clipPath, copyOp: getComputedStyle(document.querySelector(".hero-copy")).opacity }));
  if (r.clip === "none" || r.clip.startsWith("inset(0%")) fails.push(`film not framed after a viewport: ${r.clip}`);
  if (Number(r.copyOp) > 0.05) fails.push(`copy still visible after a viewport: ${r.copyOp}`);
  await page.screenshot({ path: `${OUT}/hero-scrolled.png` });
  await page.close();
}
await browser.close();
console.log(fails.length ? "FAIL\n" + fails.join("\n") : "hero probe: all clear");
process.exit(fails.length ? 1 : 0);
```

Then measure the background crop's contrast after the probe runs: `convert $OUT/hero-bg.png -colorspace Gray -format "%[fx:mean]\n" info:` and check `(0.93+0.05)/(mean_linearised+0.05) ≥ 4.5` with the same python as Task 3 Step 3 (the crop already includes the scrim, so use `l = mean**2.2`, no further blending).

- [ ] **Step 2: Run the probe against the current build and watch it fail**

Run (server from Task 2 Step 4 must be up, or start it again): `export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH; OUT=/tmp/claude-1000/-home-shanks-Music--shanks-parth-website/95973415-386d-496e-8a48-428b3f2f6ad3/scratchpad/shots node scripts/_hero.tmp.mjs`
Expected: FAIL. `.hero-film`, `.hero-strip`, `.hero-watch` do not exist yet, so the evaluate calls throw. That is the failing state.

- [ ] **Step 3: Rewrite `Hero.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import ImageTrail from "@/components/bits/ImageTrail";
import { clips, credibility, disciplines, site } from "@/lib/content";
import { DUR, EASE, gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";
import { openReel } from "@/lib/reel";

// §4.01 of the brief.
const HEADLINE = ["We build content", "systems that make", "brands impossible", "to ignore."];

/** Twelve frames for the trail, two per discipline, mixed. */
const TRAIL = Array.from({ length: 3 }, (_, k) => disciplines.map((d) => d.items[(k * 2) % d.items.length].thumb)).flat().slice(0, 12);

/**
 * 01 — the hero: the frame (motion #17).
 *
 * The footage fills the viewport from the first paint, under a flat ink
 * scrim; the headline sits bottom-left over it in paper and condenses into
 * place as its letters rise; the credibility strip and one round Watch
 * button follow. The pointer leaves a trail of work over the footage.
 *
 * Scroll: over the first viewport the footage shrinks to a framed card at
 * the right, the scrim lifts, the copy leaves, and the paper page rises
 * under it. The hero is sticky inside a taller track and the next section
 * overlaps the track's tail, so the curtain needs no pin and no script.
 * Under reduced motion the track collapses and the hero is one still
 * viewport with the poster frame.
 */
export default function Hero() {
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (reduced) return;

    // The footage starts on the handoff, never before, and only spends
    // decode while on screen. Phones take the 720p cut.
    const v = video.current;
    let io: IntersectionObserver | undefined;
    let started = false;
    const start = () => {
      if (!v || started) return;
      started = true;
      if (window.matchMedia("(max-width: 767px)").matches) v.src = clips.heroSmall.src;
      v.preload = "auto";
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
      io.observe(v);
    };
    const stopWaiting = whenIntroDone(start);

    // The frame, scrubbed over the first viewport of scroll. The copy is
    // gone in the first fifth; the film is a card by the end.
    const scrub = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=100%", scrub: 0.5 },
          defaults: { ease: "none" },
        })
        .to(".hero-copy", { y: -60, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0)
        .to(".hero-trail", { autoAlpha: 0, duration: 0.12 }, 0)
        .to(".hero-watch", { autoAlpha: 0, scale: 0.8, duration: 0.15 }, 0)
        .to(".hero-scrim", { opacity: 0, duration: 0.5 }, 0.1)
        .to(".hero-film", { clipPath: "inset(12% 4% 12% 52%)", duration: 0.75, ease: "power2.inOut" }, 0.15)
        .to(".hero-film video", { scale: 1.06, duration: 0.75, ease: "power2.inOut" }, 0.15);
    }, el);

    // The arrival, built now so its start states hold under the loader's
    // panel, and played on the handoff.
    let arrive = () => {};
    const reveal = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".hero-copy .poster--xl", { "--wdth": 118 }, { "--wdth": 62, duration: DUR.reveal * 1.5, ease: EASE.out }, 0);
      tl.from(".hero-strip > *", { opacity: 0, y: 10, duration: DUR.base, ease: EASE.out, stagger: 0.08 }, 0.9);
      tl.from(".hero-watch", { opacity: 0, scale: 0.6, duration: DUR.base, ease: "back.out(1.6)" }, 1.3);
      arrive = () => {
        tl.play();
      };
    }, el);
    const stopArrival = whenIntroDone(arrive);

    return () => {
      stopWaiting();
      stopArrival();
      io?.disconnect();
      reveal.revert();
      scrub.revert();
    };
  }, []);

  return (
    <div ref={track} className="hero-track">
      <section className="hero">
        {/* The footage. Under reduced motion only the poster paints. */}
        <div className="hero-film" aria-hidden>
          <video ref={video} src={clips.hero.src} poster={clips.hero.poster} muted loop playsInline preload="none" />
        </div>
        {/* Flat ink under the type, so paper on a moving picture stays legible. */}
        <div className="hero-scrim" aria-hidden />

        {/* React Bits ImageTrail: the pointer leaves the work behind it. */}
        <ImageTrail items={TRAIL} threshold={110} size={190} className="hero-trail" />

        <Shell className="hero-copy relative flex flex-1 flex-col justify-end pb-[calc(var(--gutter)+0.5rem)] pt-28 md:pt-20">
          <Group onLoad stagger={0.07}>
            <Poster as="h1" size="xl" lines={HEADLINE} script="kingmakers" scriptLine={1} start="intro" className="hero-poster" />
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal="fade">
              <Magnet padding={40} magnetStrength={3}>
                <Link href="/contact" className="button button--paper">
                  Start a Project
                </Link>
              </Magnet>
              <Link href="/work" className="link-underline small text-paper">
                See Our Work →
              </Link>
            </div>
            <p className="hero-strip" aria-label={`Credibility: ${credibility.join(", ")}`}>
              {credibility.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          </Group>
        </Shell>

        <Magnet padding={60} magnetStrength={3}>
          <button type="button" onClick={openReel} className="hero-watch" aria-label={`Watch the ${site.name} showreel`}>
            <span>Watch</span>
            <span>reel</span>
          </button>
        </Magnet>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Replace the hero CSS**

In `app/globals.css`, delete everything from the comment block that begins `/* ------- The hero: three acts on one scroll` through the `.hero-tag` phone media query (the block ends just before `/* ------- ... mirror wall` or whichever rule follows `.hero-tag`). Keep the three rules `.hero-track + :not(.reel-player)`, `.hero-track ~ :not(.reel-player)` and `.ticker { background }` by re-adding them below. Insert:

```css
/* ---------------------------------------------------------------------------
   The hero: the frame. Footage fills the viewport under a flat scrim; the
   headline sits over it bottom-left in paper. The hero is sticky inside a
   taller track; the section after the track starts a viewport early and
   rides up over it. That is the curtain, and it needs no pin and no script.
   JS adds only the scrub that frames the footage over the first viewport.
   ------------------------------------------------------------------------ */
.hero-track {
  position: relative;
  z-index: 0;
  min-height: calc(100svh + var(--hero-open) + var(--hero-curtain));
}
.hero {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  overflow: hidden;
  background: var(--color-ink);
  color: var(--color-paper);
}
/* Everything after the hero rides over it: the first thing starts a
   viewport early, and all of it paints above the sticky film. The reel
   player is fixed and stays out of this. */
.hero-track + :not(.reel-player) {
  margin-top: calc(-1 * var(--hero-curtain));
}
.hero-track ~ :not(.reel-player) {
  position: relative;
  z-index: 1;
}
@media (prefers-reduced-motion: reduce) {
  .hero-track {
    min-height: 0;
  }
  .hero {
    position: relative;
  }
  .hero-track + :not(.reel-player) {
    margin-top: 0;
  }
  .hero-film video {
    display: none;
  }
  .hero-film {
    background: url("/assets/webgl/hero-poster.jpg") center / cover no-repeat;
  }
}

/* The footage. Full-bleed at rest; the scrub clips it to a card. */
.hero-film {
  position: absolute;
  inset: 0;
  z-index: 0;
  clip-path: inset(0 0 0 0);
  background: var(--color-ink);
}
.hero-film video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: 60% 50%;
}
/* Flat ink, no gradient: paper type on a moving picture needs a floor.
   0.5 here plus the darker encode clears 4.5:1 on the brightest frame. */
.hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--color-ink);
  opacity: 0.5;
  pointer-events: none;
}
.hero-trail {
  z-index: 2;
  pointer-events: none;
}
.trail-img {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  opacity: 0;
  outline: 6px solid var(--color-paper);
  will-change: transform, opacity;
}
.hero-copy {
  z-index: 3;
  color: var(--color-paper);
}
.hero-copy .text-paper {
  color: var(--color-paper);
}
.hero-copy .link-underline::after {
  background: currentColor;
}
/* The headline condenses into place: Hero.tsx tweens --wdth 118 → 62. Four
   stepped lines, the links and the strip share the lower half of the
   viewport, so the size is capped by height as well as width. */
.hero-poster {
  font-variation-settings: "wdth" var(--wdth, 62), "wght" 800;
  font-size: clamp(2.5rem, min(9.5vw, 9.5svh), 9rem);
  color: var(--color-paper);
}
.hero-poster .poster-script {
  color: var(--color-signal-band);
}
.hero-poster .split-parent,
.hero-poster .split-parent > div {
  line-height: 0.86;
}
@media (min-width: 768px) {
  .hero-poster .poster-row:nth-child(2) {
    padding-left: 4vw;
  }
  .hero-poster .poster-row:nth-child(3) {
    padding-left: 1.5vw;
  }
  .hero-poster .poster-row:nth-child(4) {
    padding-left: 6vw;
  }
}
/* The credibility strip: a static line, four items, dots between. */
.hero-strip {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  color: var(--color-paper-dim);
}
.hero-strip > span + span::before {
  content: "·";
  margin-inline: 0.75rem;
  color: var(--color-paper-faint);
}
/* One round Watch button, bottom-right. The only control over the footage. */
.hero-watch {
  position: absolute;
  right: var(--gutter);
  bottom: calc(var(--gutter) + 0.5rem);
  z-index: 4;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 1px solid var(--color-paper);
  background: transparent;
  color: var(--color-paper);
  display: grid;
  place-content: center;
  line-height: 1;
  font-family: var(--font-display);
  font-variation-settings: "wdth" 90, "wght" 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background var(--dur-quick) var(--ease-out), color var(--dur-quick) var(--ease-out);
}
.hero-watch:hover,
.hero-watch:focus-visible {
  background: var(--color-paper);
  color: var(--color-ink);
}
.hero-watch:focus-visible {
  outline-color: var(--color-signal-band);
}
.button--paper {
  border-color: var(--color-paper);
  color: var(--color-paper);
}
.button--paper:hover,
.button--paper:focus-visible {
  background: var(--color-paper);
  color: var(--color-ink);
}
@media (max-width: 767px) {
  .hero-copy {
    padding-bottom: 7rem;
  }
  .hero-watch {
    bottom: var(--gutter);
    width: 4.25rem;
    height: 4.25rem;
  }
}
.ticker {
  background: var(--color-paper);
}
```

Remove the old `.button--paper` rule and the old `.trail-img` rule wherever they sat (they are re-declared above). `grep -n "hero-reel\|hero-tag\|hero-over\|hero-cue" app/globals.css` must print nothing.

- [ ] **Step 5: Take the strip out from under the hero**

In `app/page.tsx` delete the `<Ticker items={credibility} label="Credibility" />` line and the `import { credibility } from "@/lib/content";` line. `Ticker` is still imported by `Capabilities.tsx`; if `app/page.tsx` no longer uses `Ticker`, delete its import there too.

- [ ] **Step 6: Build and run the probe**

```bash
export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH
npm run lint && npx tsc --noEmit && npm run build
ss -ltnp | grep -E ':3123 ' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u | xargs -r kill; sleep 1
(nohup npx next start -p 3123 > /tmp/claude-1000/next3123.log 2>&1 &); sleep 3
OUT=/tmp/claude-1000/-home-shanks-Music--shanks-parth-website/95973415-386d-496e-8a48-428b3f2f6ad3/scratchpad/shots; mkdir -p $OUT
node scripts/_hero.tmp.mjs
convert $OUT/hero-bg.png -colorspace Gray -format "%[fx:mean]\n" info:
```
Expected: `hero probe: all clear`, and the grey mean, linearised (`mean**2.2`), gives paper contrast ≥ 4.5:1. If the phone check fails on the fold, reduce `.hero-poster`'s phone size floor from `2.5rem` to `2.25rem` and re-run; if the contrast check fails, the encode is too bright: re-run Task 3 Step 4 with `brightness=-0.12`.

- [ ] **Step 7: Look at the three screenshots**

Open `hero-1440.png`, `hero-390.png`, `hero-scrolled.png` with the Read tool. Check: paper headline bottom-left over footage; blue script on line two; the two links and the strip under it; the round Watch button bottom-right; on the phone everything above the fold; after a viewport the film is a card on the right over paper and the copy is gone. Fix what is wrong, re-run Step 6.

- [ ] **Step 8: Run the audit**

Run: `PORT=3123 node scripts/audit.mjs | tail -3`
Expected: `violations: 0  overflow: 0`. A `color-contrast` hit on `.hero-strip` means the paper-dim on the scrim is short: raise `.hero-strip` to `color: var(--color-paper)`.

- [ ] **Step 9: Update DESIGN.md, clean up**

In DESIGN.md §5 motion row 17, replace the description with: `The frame. Footage fills the viewport under a 0.5 ink scrim; the headline condenses in over it as its letters rise, the strip and the Watch button follow. Over the first viewport of scroll the copy leaves, the scrim lifts and the footage clips to a card at the right while the paper page rises under it; the next scene then rides over the track's tail (the curtain). Reduced motion: one still viewport, the poster frame.` In §4's pages table change `01 hero · credibility strip` to `01 hero (the frame, with the strip)`.

Delete the probe: `rm scripts/_hero.tmp.mjs`. Kill the server by port.

- [ ] **Step 10: Stage**

```bash
git add components/home/Hero.tsx app/globals.css app/page.tsx DESIGN.md
```

---

### Task 5: Media beside the belief, the offer, the numbers, the audiences

**Files:**
- Modify: `components/home/Positioning.tsx`
- Modify: `components/home/Offer.tsx`
- Modify: `components/home/Record.tsx`
- Modify: `components/home/Clients.tsx` (only the audiences block above `<div ref={roster}`)
- Create: `components/media/Loop.tsx`
- Modify: `app/globals.css` (append `.loop`, `.numbers-wall`, `.audience-frame` rules)

**Interfaces:**
- Consumes: `clips.bts`, `numbersWall`, `audienceFrames` from Task 3.
- Produces: `Loop({ clip, className, label })`, a client component: a muted looping video that plays only in view and respects reduced motion.

- [ ] **Step 1: Write `Loop.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * A silent loop that only spends decode while on screen and never plays
 * under reduced motion, where the poster is the frame. Decorative: it
 * carries no information the copy beside it does not.
 */
export default function Loop({ clip, className = "", label }: { clip: Clip; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion()) return;
    v.preload = "auto";
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`loop ${className}`}>
      <video ref={ref} src={clip.src} poster={clip.poster} muted loop playsInline preload="none" aria-hidden />
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
```

Append to `app/globals.css`:

```css
/* A silent loop beside copy. Clipped to the layout's ratio, paper edge. */
.loop {
  position: relative;
  margin: 0;
  overflow: hidden;
  background: var(--color-paper-deep);
  aspect-ratio: 4 / 3;
}
.loop video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.loop--wide {
  aspect-ratio: 16 / 9;
}
/* The faint wall behind the numbers: six by three, never interactive. */
.numbers-wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  opacity: 0.18;
  pointer-events: none;
  filter: saturate(0.6);
}
.numbers-wall > span {
  position: relative;
  overflow: hidden;
}
@media (max-width: 767px) {
  .numbers-wall {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
}
/* One frame per audience card. */
.audience-frame {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-paper-deep);
  margin-bottom: 1.25rem;
}
```

- [ ] **Step 2: The belief gets the BTS loop**

In `components/home/Positioning.tsx`: add `import Loop from "@/components/media/Loop";` and `import { clips } from "@/lib/content";`. Replace the copy grid:

```tsx
        <Group className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            {COPY.map((p, i) => (
```

with:

```tsx
        <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-4" data-reveal="frame">
            <Loop clip={clips.bts} label="Behind the scenes on an Experience Media shoot" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {COPY.map((p, i) => (
```

(`data-reveal="frame"` scales the figure 1.08 → 1 as the group reveals; the `.loop` is `overflow: hidden`, so the scale is clipped.)

- [ ] **Step 3: The offer's Day 01 gets the same loop**

In `components/home/Offer.tsx`: same two imports. Replace the days block's `<div className="row-body">` for the first day only, by mapping with the index:

```tsx
        {offer.days.map((d, i) => (
          <div key={d.n} className="row">
            <span className="row-rule" data-reveal="rule" />
            <Line as="h3" className="row-title poster">
              <span className="num mr-4">{d.n}</span>
              {d.title}
            </Line>
            <div className="row-body md:grid md:grid-cols-12 md:gap-8">
              <p className="lede max-w-[46ch] text-ink-dim md:col-span-7" data-reveal="fade">{d.body}</p>
              {i === 0 && (
                <div className="mt-6 md:col-span-4 md:col-start-9 md:mt-0" data-reveal="frame">
                  <Loop clip={clips.bts} className="loop--wide" label="A shoot day with Experience Media" />
                </div>
              )}
            </div>
          </div>
        ))}
```

- [ ] **Step 4: The numbers get the wall**

In `components/home/Record.tsx`: add `import Image from "next/image";` and change the content import to `import { metrics, numbersWall } from "@/lib/content";`. Replace `<div ref={root}>` with:

```tsx
      <div ref={root} className="relative">
        <div className="numbers-wall" aria-hidden>
          {numbersWall.map((t) => (
            <span key={t}>
              <Image src={t} alt="" fill sizes="(min-width: 768px) 17vw, 33vw" loading="lazy" className="object-cover" />
            </span>
          ))}
        </div>
        <div className="relative z-[1]">
```

and close the extra `</div>` before the final `</div>` of the `ref={root}` element. The counters, the lead and the row are unchanged inside.

`Record.tsx` is a client component; `numbersWall` is plain data from `media.ts`, so the import is safe.

- [ ] **Step 5: The audiences get a frame each**

In `components/home/Clients.tsx` change the import line to `import { audienceFrames, audiences, brands, creatorPortraits } from "@/lib/content";` and replace the audiences block:

```tsx
      <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3" stagger={0.08}>
        {audiences.map((a) => {
          const key = a.title.toLowerCase().replace(/\s+/g, "-") as keyof typeof audienceFrames;
          return (
            <div key={a.title} className="border-t border-hairline pt-6" data-reveal="fade">
              <div className="audience-frame">
                <Image src={audienceFrames[key]} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" loading="lazy" className="object-cover" data-reveal="frame" />
              </div>
              <h3 className="poster poster--m">{a.title}</h3>
              <p className="lede mt-4 max-w-[34ch] text-ink-dim">{a.body}</p>
            </div>
          );
        })}
      </Group>
```

The keys are `business-owners`, `content-creators`, `brands`, matching `audienceFrames`. Nothing below `<div ref={roster}` changes.

- [ ] **Step 6: Build, audit, look**

```bash
export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH
npm run lint && npx tsc --noEmit && npm test && npm run build
(nohup npx next start -p 3123 > /tmp/claude-1000/next3123.log 2>&1 &); sleep 3
PORT=3123 node scripts/audit.mjs | tail -3
```
Expected: clean, `violations: 0  overflow: 0`. Screenshot `#studio`, `#offer`, the numbers scene and `#clients` at 1440 and 390 (same shot script shape as Task 4 Step 1, section 3) and check: the BTS loop plays beside the belief copy and under Day 01; the wall sits faint behind 500M+ and the figures still read; each audience card opens with a frame. Kill the server by port.

- [ ] **Step 7: Stage**

```bash
git add components/media/Loop.tsx components/home/Positioning.tsx components/home/Offer.tsx components/home/Record.tsx components/home/Clients.tsx app/globals.css
```

---

### Task 6: The founder, the process cards, the capabilities band, the playbook cover

**Files:**
- Modify: `components/home/FounderStory.tsx`, `components/home/Founder.tsx`
- Create: `components/home/FounderFrame.tsx` (server component)
- Modify: `components/home/Process.tsx`
- Modify: `components/home/Capabilities.tsx`, `components/home/Ticker.tsx`
- Create: `components/training/PlaybookCover.tsx`
- Modify: `components/home/Training.tsx`, `app/training/page.tsx`
- Modify: `app/globals.css` (append `.founder-frame`, `.stack-frame`, `.ticker-frame`, `.cover` rules)
- Modify: `DESIGN.md` §4 pages line and §5 rows for the sections that gained media

**Interfaces:**
- Consumes: `founderMedia`, `processFrames`, `capabilityFrames` from Task 3; `Loop` from Task 5.
- Produces: `FounderFrame({ className })`, `PlaybookCover({ className })`; `Ticker` gains `frames?: string[]`.

- [ ] **Step 1: The founder frame, with the slot**

```tsx
// components/home/FounderFrame.tsx — server component: reads the founder
// asset at build time. With no file it is a labelled paper slot, never a
// stock image, so the page is honest about what is missing.
import Image from "next/image";
import Loop from "@/components/media/Loop";
import { site } from "@/lib/content";
import { founderMedia } from "@/lib/content/founder-media";

export default function FounderFrame({ className = "" }: { className?: string }) {
  if (!founderMedia) {
    return (
      <div className={`founder-frame founder-frame--slot ${className}`} aria-hidden>
        <span className="micro">{site.founder}</span>
        <span className="small text-ink-faint">photo to follow</span>
      </div>
    );
  }
  if (founderMedia.video) {
    return <Loop clip={{ src: founderMedia.video, poster: founderMedia.image }} className={`founder-frame ${className}`} label={`${site.founder}, ${site.founderRole}`} />;
  }
  return (
    <div className={`founder-frame ${className}`}>
      <Image src={founderMedia.image} alt={`${site.founder}, ${site.founderRole}`} fill sizes="(min-width: 768px) 33vw, 100vw" loading="lazy" className="object-cover" data-reveal="frame" />
    </div>
  );
}
```

Append to `app/globals.css`:

```css
/* The founder. A 4:5 frame; the slot is the same shape in paper-deep with
   a hairline, so the layout holds until the photo arrives. */
.founder-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--color-paper-deep);
}
.founder-frame--slot {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.25rem;
  padding: var(--gutter);
  border: 1px solid var(--color-hairline);
}
```

In `components/home/FounderStory.tsx`: `import FounderFrame from "@/components/home/FounderFrame";` and replace the second grid column so the story has the frame at right and the CTA under it:

```tsx
        <div className="md:col-span-4 md:col-start-9">
          <div data-reveal="fade">
            <FounderFrame />
          </div>
          <p className="mt-8" data-reveal="fade">
            <Magnet padding={40} magnetStrength={3}>
              <Link href="/about" className="button">
                Meet Parth →
              </Link>
            </Magnet>
          </p>
        </div>
```

In `components/home/Founder.tsx`: same import; inside the first column (`md:col-span-3`), insert `<div className="mb-6" data-reveal="fade"><FounderFrame /></div>` as the first child, before the name.

- [ ] **Step 2: The process cards get a frame**

In `components/home/Process.tsx`: `import Image from "next/image";` and `import { process, processClose, processFrames } from "@/lib/content";`. Map with the index:

```tsx
        {process.map((step, i) => (
          <ScrollStackItem key={step.title} itemClassName="stack-card">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <div className="md:col-span-7">
                <p className="num">{step.n}</p>
                <h3 className="poster poster--m mt-3">{step.title}</h3>
                <p className="lede mt-5 max-w-[46ch] text-ink-dim">{step.body}</p>
              </div>
              <div className="stack-frame mt-6 md:col-span-4 md:col-start-9 md:mt-0" aria-hidden>
                <Image src={processFrames[i]} alt="" fill sizes="(min-width: 768px) 28vw, 100vw" loading="lazy" className="object-cover" />
              </div>
            </div>
          </ScrollStackItem>
        ))}
```

Append to `app/globals.css`:

```css
.stack-frame {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-paper-deep);
}
```

- [ ] **Step 3: The capabilities band carries frames**

In `components/home/Ticker.tsx` add an optional `frames` prop and interleave one every third word:

```tsx
import { Fragment } from "react";
import Image from "next/image";
import ScrollVelocity from "@/components/bits/ScrollVelocity";

/**
 * A band of short phrases that slides with your scroll and reverses when
 * you do (React Bits ScrollVelocity). With `frames`, a work frame sits
 * between every third word, so the band shows what it names.
 */
export default function Ticker({ items, label, frames = [], className = "" }: { items: string[]; label: string; frames?: string[]; className?: string }) {
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
```

In `components/home/Capabilities.tsx` change the import to `import { capabilities, capabilityFrames } from "@/lib/content";` and the band to `<Ticker items={capabilities} frames={capabilityFrames} label="Capabilities" className="mt-12 md:mt-16" />`.

Append to `app/globals.css` (check `.ticker-item`'s height first with `grep -n -A6 "^\.ticker-item" app/globals.css`; match the frame's height to the item's line box, about `1em` of the ticker's font size):

```css
.ticker-frame {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 1.6em;
  height: 1em;
  margin-inline: 0.35em;
  overflow: hidden;
  background: var(--color-paper-deep);
}
```

- [ ] **Step 4: The playbook cover, in CSS**

```tsx
// components/training/PlaybookCover.tsx — the 30-day playbook as a cover,
// set in the site's type. No photo: the product is a document.
import Emblem from "@/components/brand/Emblem";
import { training } from "@/lib/content";

export default function PlaybookCover({ className = "" }: { className?: string }) {
  return (
    <div className={`cover ${className}`} aria-hidden>
      <span className="cover-days poster">30</span>
      <span className="cover-title poster">{training.product.replace(/^30-Day /, "")}</span>
      <span className="cover-foot">
        <Emblem className="h-5 w-auto" />
        <span className="micro">free · day one to day thirty</span>
      </span>
    </div>
  );
}
```

Append to `app/globals.css`:

```css
/* The playbook cover: a 3:4 sheet in ink with paper type, the way the
   band is set. Tilted a hair, like the sticker it replaces. */
.cover {
  position: relative;
  aspect-ratio: 3 / 4;
  max-width: 360px;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--color-ink);
  color: var(--color-paper);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: rotate(-2deg);
  outline: 8px solid var(--color-paper);
  outline-offset: -8px;
}
.cover-days {
  font-size: clamp(5rem, 12vw, 9rem);
  line-height: 0.8;
  color: var(--color-signal-band);
}
.cover-title {
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  max-width: 10ch;
}
.cover-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-paper-faint);
}
.cover .micro {
  color: var(--color-paper-faint);
}
```

In `components/home/Training.tsx` replace the second column:

```tsx
        <div className="md:col-span-4 md:col-start-9" data-reveal="fade">
          <PlaybookCover />
          <p className="small mt-8 text-ink-dim">Coming next</p>
          <p className="small mt-2 text-ink-dim">{training.future.join(" · ")}</p>
        </div>
```

with `import PlaybookCover from "@/components/training/PlaybookCover";`. In `app/training/page.tsx`, inside the playbook scene's first column, insert `<div className="mt-10 max-w-[300px]" data-reveal="fade"><PlaybookCover /></div>` after the week list, with the same import.

- [ ] **Step 5: Build, audit, look, document**

```bash
export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH
npm run lint && npx tsc --noEmit && npm test && npm run build
(nohup npx next start -p 3123 > /tmp/claude-1000/next3123.log 2>&1 &); sleep 3
PORT=3123 node scripts/audit.mjs | tail -3
```
Expected: clean and `violations: 0  overflow: 0`. If `next build` fails with the `server-only` message, a client file imports `founder-media`: fix the import, do not add fs shims.

Screenshot the founder story, Founder's Corner, the process stack, the capabilities band, the training section and `/training` at 1440 and 390. Check: the slot (or photo) sits at the right of the story and above the name in the Corner; each process card shows a frame at right; frames ride between the band's words; the cover reads "30 / Content Growth Playbook".

In DESIGN.md's home sections line, append "(with media)" to 03, 04, 05, 06, 07, 09, 10, 13 and 14; in §5 add one row: `| 23 | Loops and frames | In view | Every loop beside copy is silent, plays only while on screen, and is a still under reduced motion. The founder frame is a labelled slot until the photo exists. |`

Kill the server by port.

- [ ] **Step 6: Stage**

```bash
git add components/home/FounderFrame.tsx components/home/FounderStory.tsx components/home/Founder.tsx components/home/Process.tsx components/home/Ticker.tsx components/home/Capabilities.tsx components/training/PlaybookCover.tsx components/home/Training.tsx app/training/page.tsx app/globals.css DESIGN.md
```

---

### Task 7: Whole-site verification and the memory note

**Files:**
- Create then delete: `scripts/_final.tmp.mjs`
- Modify: `/home/shanks/.claude/projects/-home-shanks-Music--shanks-parth-website/memory/redevelopment-brief-2026-10.md` (the accent swap is no longer open) and `MEMORY.md`'s hook for it

- [ ] **Step 1: Full gate**

```bash
export PATH=/usr/bin:/bin:$HOME/.nvm/versions/node/v24.15.0/bin:$PATH
npm run lint && npx tsc --noEmit && npm test && npm run build
ss -ltnp | grep -E ':3123 ' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u | xargs -r kill; sleep 1
(nohup npx next start -p 3123 > /tmp/claude-1000/next3123.log 2>&1 &); sleep 3
PORT=3123 node scripts/audit.mjs | tail -24
grep -rn "sun\|mint\|rose\|#ff2d20\|redblock" app/globals.css DESIGN.md components | grep -iv "sunday\|resume\|promise" ; echo "(expect nothing above)"
```
Expected: every route `clean`, `violations: 0  overflow: 0`, the grep empty.

- [ ] **Step 2: Console and page sweep**

```js
// scripts/_final.tmp.mjs
import { chromium } from "playwright";
const CHROME = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell";
const browser = await chromium.launch({ args: ["--disable-gpu"], executablePath: CHROME });
const errors = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${w} ${m.text().slice(0, 160)}`); });
  page.on("pageerror", (e) => errors.push(`${w} pageerror ${e.message.slice(0, 160)}`));
  for (const url of ["/", "/work", "/work/vfx-cgi", "/about", "/production", "/training", "/contact"]) {
    await page.goto(`http://localhost:3123${url}`, { waitUntil: "load" });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1500);
    for (let y = 0; y < 12000; y += h) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scrollW > w) errors.push(`${w} ${url} overflow ${scrollW}`);
  }
  await page.close();
}
await browser.close();
console.log(errors.length ? "ERRORS\n" + errors.join("\n") : "sweep clean");
process.exit(errors.length ? 1 : 0);
```

Run: `node scripts/_final.tmp.mjs`. Expected: `sweep clean`. Then `rm scripts/_final.tmp.mjs` and kill the server by port.

- [ ] **Step 3: Update memory**

In the memory file named above, change the open item `(1) the single electric-blue accent ... — not done` to `(1) the accent swap and "the frame" hero shipped on 2026-10-13 (spec: docs/superpowers/specs/2026-10-13-charcoal-blue-and-the-frame-design.md); the founder photo at public/assets/founder/parth.jpg is the remaining asset gap`. Update the `MEMORY.md` hook line to `brief in repo root is the copy/metrics source of truth; v4 colour and hero shipped; founder photo and playbook PDF still open`.

- [ ] **Step 4: Refresh the graph and report**

Run: `graphify update .` Then report to the user: what changed, the measured contrasts, the screenshots, what remains (the founder file, the playbook PDF, the Resend key), and that nothing is committed.
