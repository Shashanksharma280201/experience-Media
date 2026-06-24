# Experience Media — "Content Multiverse" WebGL Layer Design

**Date:** 2026-06-24
**Status:** Approved
**Goal:** Add an oryzo.ai-style real-time WebGL experience to the existing v1 site —
a scroll-driven 3D "Content Multiverse" where the agency's video work floats in a
dark void and the camera flies through it. Achievable solo (no photoreal modeling,
no 3D artist), layered onto the v1 content so SEO/accessibility are preserved.

## Reference

Built on the teardown of [oryzo.ai by Lusion](https://lusion.co/projects/oryzo_ai/):
fixed persistent canvas + tall scroll page, scroll scrubs a 3D scene. We adapt the
*idea* (their physical product → our video work) at an achievable fidelity tier.

## Locked decisions

| Area | Decision |
|------|----------|
| Fidelity tier | Achievable WebGL — React Three Fiber + GLSL + scroll-driven **procedural** camera (no baked Blender cameras, no gaussian splats) |
| 3D concept | **Content Multiverse** — floating video/thumbnail "screens" in a dark void; showreel on hero plane; scroll = fly-through |
| Asset production | Procedural + existing footage + CC0 only. **No 3D modeling, no commissions.** |
| Scope | WebGL hero + scroll moments **layered on v1**; v1 content/structure/DOM retained |
| Architecture | Approach A — integrate R3F into the existing Next.js v1 app (single fixed canvas, Lenis-synced DOM scroll) |
| Screens content (v1) | **Static thumbnails first**; architecture supports dropping in short video loops later as an upgrade (decision: do not block v1 on clip-loop production) |

## Architecture

- A single fixed, full-viewport **R3F `<Canvas>`** mounted in the v1 root layout,
  rendered behind the scrolling DOM (`pointer-events` enabled only for interactive
  screens via raycast).
- **Lenis** stays the scroll source of truth. A shared `scrollProgress` (0→1) context
  feeds both DOM (existing GSAP reveals) and the 3D scene.
- 3D scene reads scroll progress to drive a **procedural Catmull-Rom camera spline**
  through the void and per-object animations. No baked cameras.
- DOM sections keep their real HTML and visually "hand off" to the canvas at section
  boundaries (canvas elements aligned to DOM anchors).
- WebGL is **lazy-loaded** and gated behind a capability + `prefers-reduced-motion`
  check, with a static fallback.

## Scenes & moments

**Hero — the Multiverse:** dark foggy void, subtle GPU particle field, gold key-light.
Showreel plays as a **video texture** on a hero plane. ~20–40 floating textured quads
(portfolio thumbnails) drift in depth. Scroll flies the camera forward; hero reel
recedes; overlaid DOM headline resolves. Hover → screen brightens/scales + platform
label; click → opens real YouTube/IG link (raycast).

**Section moments (aligned to existing v1 sections):**
- Creators/Brands → screens reorganize into an orbiting ring / wall.
- Services → camera pushes into a corridor; active service word as 3D text
  (troika MSDF, generated from a normal font — no asset); DOM list stays readable.
- Stat counter → particle burst forming "300,000,000+".
- Contact/footer → camera pulls back to reveal the full constellation of all work.

## Rendering & shaders

- `@react-three/postprocessing`: bloom, chromatic aberration, vignette, noise/grain,
  subtle depth-of-field (DOF desktop-only).
- Custom GLSL: screen hover distortion (ripple / RGB-split), screen reveal/dissolve on
  enter, particle field.
- CC0 HDRI (Poly Haven) for reflections/lighting.
- Palette unchanged: near-black void, paper-white text, single gold accent (`#c8920a`).

## Performance & accessibility (non-negotiable)

- Device tiers: full desktop; mobile = fewer screens, no DOF / lighter post; low-end /
  `prefers-reduced-motion` / no-WebGL = static hero image + plain v1.
- Video texture throttled; thumbnails compressed (AVIF/KTX2); DPR clamped; canvas
  pauses on `document.hidden`.
- DOM content stays the real crawlable page; OG/SEO unaffected.

## Tech stack additions

`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`,
`troika-three-text`, `maath`. (lenis + gsap already present.)

## Proposed structure

```
components/webgl/
  WebGLCanvas.tsx        fixed <Canvas>, capability gate, lazy mount
  Scene.tsx              scene graph, fog, lights, post-processing
  Multiverse.tsx         the floating-screens system
  Screen.tsx             single textured quad + hover/click + shader
  HeroReel.tsx           video-texture hero plane
  ParticleField.tsx      GPU particles
  CameraRig.tsx          scroll-driven Catmull-Rom camera
  Text3D.tsx             troika MSDF service words
  effects/               GLSL shader chunks
hooks/
  useScrollProgress.ts   Lenis → 0..1 context
  useWebGLCapability.ts  tier detection + reduced-motion
lib/
  webgl-content.ts       screen layout (positions from portfolio data)
public/assets/webgl/
  hero-loop.{mp4,webm}   optimized showreel loop (to be produced)
  hero-poster.jpg        static fallback/OG frame (to be produced)
  thumbs/                uniform-crop thumbnails (to be produced)
  hdri/                  CC0 environment map
```

## Assets to produce

**Must-have:**
1. Optimized hero reel loop — seamless 6–12s 1080p loop from the showreel, muted,
   H.264 + WebM, color-graded (current 14MB file too heavy for a video texture).
2. Static hero poster image — fallback / reduced-motion / OG / SEO (1 frame).
3. Uniform thumbnail crops — re-export ~35 portfolio thumbnails to consistent aspect
   ratios (16:9 + 9:16 sets).

**High-impact, optional (post-v1 upgrade):**
4. 6–12 short muted clip loops (3–6s) of best edits → swap in for static screens.
5. Clean SVG of EM emblem/wordmark → optional 3D logotype moment.

**Not needed (procedural / CC0):** void, particles, fog, camera path, shaders, 3D
text, HDRI lighting. No 3D modeling, no commissions.

## Out of scope (v1 of the WebGL layer)

- Gaussian splats, baked cameras, photoreal PBR, TAA, WebGPU.
- Audio/sfx.
- Rebuilding the whole homepage as one continuous scene (kept as v1 + moments).

## Success criteria

- A WebGL hero multiverse + ≥2 scroll moments, scroll-synced to the v1 DOM.
- Interactive screens link out to the real videos.
- 60fps on a typical desktop; graceful tiered fallback on mobile/low-end.
- `prefers-reduced-motion` and no-WebGL paths render the v1 site cleanly.
- No regression to v1 content, SEO, or the contact flow.
- `next build` clean; deploys on Vercel.
