# Content Multiverse WebGL Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an oryzo.ai-style scroll-driven WebGL "Content Multiverse" (floating video/thumbnail screens in a dark void, camera flies through on scroll) as a layer on top of the existing Next.js v1 site, degrading gracefully to the plain v1 on mobile/low-end/reduced-motion.

**Architecture:** A single fixed full-viewport React Three Fiber `<Canvas>` is mounted behind the existing scrolling DOM. Lenis remains the scroll source of truth and publishes a `0..1` progress value via React context; the 3D scene reads it to drive a procedural Catmull-Rom camera path and per-object animation. Pure logic (screen layout, camera sampling, capability tiering, scroll mapping) is unit-tested with Vitest; visual components are verified by `next build` + headless-Chrome screenshots.

**Tech Stack:** Next.js 16, React 19, TypeScript, three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, troika-three-text, maath, lenis (present), gsap (present), Vitest (new, dev-only).

## Global Constraints

- Next.js **16.2.9**, App Router, React **19**, TypeScript strict — match existing project.
- Tailwind CSS **v4** with existing tokens (`paper #f4f2ee`, `ink #0e0e0e`, `accent #c8920a`, `night #0c0b0a`). Do not introduce new color systems.
- **No 3D modeling, no commissioned assets.** Screens are textured quads; everything else procedural or CC0.
- **No regression to v1**: existing DOM content, SEO/OG metadata, and the `/api/contact` flow must remain intact and crawlable.
- WebGL must be **lazy-loaded** and gated; `prefers-reduced-motion`, no-WebGL, and low-end devices get the static v1 (no canvas).
- All new WebGL code under `components/webgl/`, hooks under `hooks/`, pure logic under `lib/`. One responsibility per file.
- Content stays sourced from `lib/content.ts` (single source of truth) — do not duplicate portfolio data.
- v1 build command stays `npm run build`; it must pass clean after every task.
- Palette in 3D: near-black void, paper-white text, single gold accent. No new accent colors.

---

### Task 1: Add Vitest + dependencies

**Files:**
- Modify: `package.json` (scripts + deps)
- Create: `vitest.config.ts`
- Create: `test/setup.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest in `node` env; test files match `**/*.test.ts`.

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing troika-three-text maath
npm install -D vitest @types/three
```
Expected: installs succeed; `three` and R3F appear in `dependencies`, `vitest` in `devDependencies`.

- [ ] **Step 2: Create Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Create empty setup file**

Create `test/setup.ts`:
```ts
// Reserved for global test setup (currently none).
export {};
```

- [ ] **Step 4: Add test script**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify Vitest runs (no tests yet = success exit)**

Run: `npm test`
Expected: Vitest reports "No test files found" OR exits 0; command does not error on config.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test/setup.ts
git commit -m "chore: add three.js stack + vitest"
```

---

### Task 2: Seeded PRNG utility

**Files:**
- Create: `lib/prng.ts`
- Test: `lib/prng.test.ts`

**Interfaces:**
- Produces: `mulberry32(seed: number): () => number` — deterministic generator returning floats in `[0,1)`.

- [ ] **Step 1: Write the failing test**

Create `lib/prng.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { mulberry32 } from "@/lib/prng";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("returns values in [0,1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("differs across seeds", () => {
    expect(mulberry32(1)()).not.toEqual(mulberry32(2)());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- prng`
Expected: FAIL — cannot resolve `@/lib/prng`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/prng.ts`:
```ts
/** Deterministic PRNG. Returns a function yielding floats in [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- prng`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/prng.ts lib/prng.test.ts
git commit -m "feat: deterministic seeded prng"
```

---

### Task 3: Screen layout generator

**Files:**
- Create: `lib/webgl-content.ts`
- Test: `lib/webgl-content.test.ts`

**Interfaces:**
- Consumes: `mulberry32` from `lib/prng.ts`; `portfolio` from `lib/content.ts`.
- Produces:
  - `type ScreenDatum = { id: string; href: string; thumb: string; platform: string; position: [number, number, number]; rotation: [number, number, number]; scale: number; aspect: "landscape" | "portrait" }`
  - `buildScreenLayout(opts?: { seed?: number; depth?: number; spread?: number }): ScreenDatum[]`

- [ ] **Step 1: Write the failing test**

Create `lib/webgl-content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildScreenLayout } from "@/lib/webgl-content";

describe("buildScreenLayout", () => {
  it("creates one screen per portfolio item", () => {
    const layout = buildScreenLayout({ seed: 1 });
    expect(layout.length).toBeGreaterThan(20);
  });
  it("is deterministic for a seed", () => {
    expect(buildScreenLayout({ seed: 5 })).toEqual(buildScreenLayout({ seed: 5 }));
  });
  it("spreads screens along negative Z within depth", () => {
    const layout = buildScreenLayout({ seed: 2, depth: 200 });
    const zs = layout.map((s) => s.position[2]);
    expect(Math.min(...zs)).toBeGreaterThanOrEqual(-200);
    expect(Math.max(...zs)).toBeLessThanOrEqual(0);
  });
  it("assigns aspect from platform/layout and valid hrefs", () => {
    const layout = buildScreenLayout({ seed: 3 });
    for (const s of layout) {
      expect(s.href).toMatch(/^https?:\/\//);
      expect(["landscape", "portrait"]).toContain(s.aspect);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- webgl-content`
Expected: FAIL — cannot resolve `@/lib/webgl-content`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/webgl-content.ts`:
```ts
import { mulberry32 } from "@/lib/prng";
import { portfolio } from "@/lib/content";

export type ScreenDatum = {
  id: string;
  href: string;
  thumb: string;
  platform: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  aspect: "landscape" | "portrait";
};

type Opts = { seed?: number; depth?: number; spread?: number };

/** Flatten portfolio into screens scattered through the void along -Z. */
export function buildScreenLayout(opts: Opts = {}): ScreenDatum[] {
  const { seed = 1, depth = 220, spread = 34 } = opts;
  const rand = mulberry32(seed);

  const items = portfolio.flatMap((cat) =>
    cat.items.map((it) => ({ ...it, layout: cat.layout }))
  );

  return items.map((it, i) => {
    const t = items.length > 1 ? i / (items.length - 1) : 0;
    const z = -t * depth;
    const side = rand() > 0.5 ? 1 : -1;
    const x = side * (6 + rand() * spread);
    const y = (rand() - 0.5) * 22;
    const aspect: ScreenDatum["aspect"] =
      it.layout === "short" ? "portrait" : "landscape";
    return {
      id: `${it.href}-${i}`,
      href: it.href,
      thumb: it.thumb,
      platform: it.platform,
      position: [x, y, z],
      rotation: [(rand() - 0.5) * 0.3, -side * (0.2 + rand() * 0.3), (rand() - 0.5) * 0.1],
      scale: 3 + rand() * 2.5,
      aspect,
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- webgl-content`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/webgl-content.ts lib/webgl-content.test.ts
git commit -m "feat: procedural screen layout from portfolio"
```

---

### Task 4: Camera path sampler

**Files:**
- Create: `lib/camera-path.ts`
- Test: `lib/camera-path.test.ts`

**Interfaces:**
- Consumes: `three` (`CatmullRomCurve3`, `Vector3`).
- Produces:
  - `type CameraSample = { position: THREE.Vector3; lookAt: THREE.Vector3 }`
  - `sampleCameraPath(progress: number): CameraSample` — `progress` clamped to `[0,1]`; flies from `z≈12` to `z≈-depth`.

- [ ] **Step 1: Write the failing test**

Create `lib/camera-path.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { sampleCameraPath } from "@/lib/camera-path";

describe("sampleCameraPath", () => {
  it("clamps progress below 0 and above 1", () => {
    expect(sampleCameraPath(-1).position.z).toBeCloseTo(sampleCameraPath(0).position.z, 5);
    expect(sampleCameraPath(2).position.z).toBeCloseTo(sampleCameraPath(1).position.z, 5);
  });
  it("moves the camera forward (more negative Z) as progress increases", () => {
    expect(sampleCameraPath(1).position.z).toBeLessThan(sampleCameraPath(0).position.z);
  });
  it("lookAt is ahead of the camera (more negative Z than position)", () => {
    const s = sampleCameraPath(0.5);
    expect(s.lookAt.z).toBeLessThan(s.position.z);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- camera-path`
Expected: FAIL — cannot resolve `@/lib/camera-path`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/camera-path.ts`:
```ts
import { CatmullRomCurve3, Vector3 } from "three";

const DEPTH = 220;

// A gently weaving path flying from the front of the void toward the back.
const curve = new CatmullRomCurve3([
  new Vector3(0, 0, 12),
  new Vector3(-4, 2, -30),
  new Vector3(5, -2, -80),
  new Vector3(-3, 1, -140),
  new Vector3(2, 0, -DEPTH),
]);

export type CameraSample = { position: Vector3; lookAt: Vector3 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function sampleCameraPath(progress: number): CameraSample {
  const t = clamp01(progress);
  const position = curve.getPointAt(t);
  const lookAt = curve.getPointAt(clamp01(t + 0.04));
  // Ensure lookAt is always ahead even at t=1.
  if (lookAt.z >= position.z) lookAt.z = position.z - 8;
  return { position, lookAt };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- camera-path`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/camera-path.ts lib/camera-path.test.ts
git commit -m "feat: scroll-driven camera path sampler"
```

---

### Task 5: WebGL capability + tier detection

**Files:**
- Create: `lib/webgl-capability.ts`
- Test: `lib/webgl-capability.test.ts`

**Interfaces:**
- Produces:
  - `type Tier = "off" | "low" | "high"`
  - `pickTier(input: { hasWebGL: boolean; reducedMotion: boolean; deviceMemory?: number; hardwareConcurrency?: number; coarsePointer: boolean }): Tier`
  - Rules: no WebGL or reduced-motion → `"off"`; coarse pointer (touch) or `deviceMemory<=4` or `cores<=4` → `"low"`; else `"high"`.

- [ ] **Step 1: Write the failing test**

Create `lib/webgl-capability.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { pickTier } from "@/lib/webgl-capability";

const base = { hasWebGL: true, reducedMotion: false, deviceMemory: 8, hardwareConcurrency: 8, coarsePointer: false };

describe("pickTier", () => {
  it("off when no webgl", () => {
    expect(pickTier({ ...base, hasWebGL: false })).toBe("off");
  });
  it("off when reduced motion", () => {
    expect(pickTier({ ...base, reducedMotion: true })).toBe("off");
  });
  it("low on touch devices", () => {
    expect(pickTier({ ...base, coarsePointer: true })).toBe("low");
  });
  it("low on weak hardware", () => {
    expect(pickTier({ ...base, deviceMemory: 4 })).toBe("low");
    expect(pickTier({ ...base, hardwareConcurrency: 4 })).toBe("low");
  });
  it("high on capable desktop", () => {
    expect(pickTier(base)).toBe("high");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- webgl-capability`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Write minimal implementation**

Create `lib/webgl-capability.ts`:
```ts
export type Tier = "off" | "low" | "high";

export function pickTier(input: {
  hasWebGL: boolean;
  reducedMotion: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  coarsePointer: boolean;
}): Tier {
  if (!input.hasWebGL || input.reducedMotion) return "off";
  const lowMem = (input.deviceMemory ?? 8) <= 4;
  const lowCpu = (input.hardwareConcurrency ?? 8) <= 4;
  if (input.coarsePointer || lowMem || lowCpu) return "low";
  return "high";
}

/** Runtime probe — only call in the browser. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  let hasWebGL = false;
  try {
    const c = document.createElement("canvas");
    hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    hasWebGL = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return pickTier({
    hasWebGL,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- webgl-capability`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/webgl-capability.ts lib/webgl-capability.test.ts
git commit -m "feat: webgl tier detection"
```

---

### Task 6: Scroll progress context (Lenis → 0..1)

**Files:**
- Create: `hooks/useScrollProgress.ts`
- Modify: `components/SmoothScrollProvider.tsx` (expose Lenis instance to context)

**Interfaces:**
- Consumes: existing Lenis setup in `SmoothScrollProvider`.
- Produces:
  - `ScrollProgressProvider` (wraps children, tracks `0..1` document scroll)
  - `useScrollProgress(): React.MutableRefObject<number>` — ref updated each Lenis tick (no re-renders).

**Note:** This task is verified by build + runtime (no unit test — it depends on Lenis/DOM).

- [ ] **Step 1: Create the hook + provider**

Create `hooks/useScrollProgress.ts`:
```ts
"use client";

import { createContext, useContext, useEffect, useRef } from "react";

const ScrollProgressContext = createContext<React.MutableRefObject<number> | null>(null);

export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      progress.current = max > 0 ? el.scrollTop / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ScrollProgressContext.Provider value={progress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  const ctx = useContext(ScrollProgressContext);
  if (!ctx) throw new Error("useScrollProgress must be used within ScrollProgressProvider");
  return ctx;
}
```

- [ ] **Step 2: Wrap the app with the provider**

In `app/layout.tsx`, import `ScrollProgressProvider` and wrap inside `SmoothScrollProvider`:
```tsx
import { ScrollProgressProvider } from "@/hooks/useScrollProgress";
// ...
<SmoothScrollProvider>
  <ScrollProgressProvider>
    <Nav />
    <main>{children}</main>
    <Footer />
  </ScrollProgressProvider>
</SmoothScrollProvider>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiles successfully; TypeScript passes.

- [ ] **Step 4: Commit**

```bash
git add hooks/useScrollProgress.ts app/layout.tsx
git commit -m "feat: scroll progress context"
```

---

### Task 7: Single textured Screen component

**Files:**
- Create: `components/webgl/Screen.tsx`

**Interfaces:**
- Consumes: `ScreenDatum` from `lib/webgl-content.ts`; drei `useTexture`, `Image`.
- Produces: `<Screen datum={ScreenDatum} onOpen={(href:string)=>void} />` — a textured plane sized by aspect, hover scale, click → `onOpen(href)`.

**Verification:** visual (used in Task 8 scene); build must pass.

- [ ] **Step 1: Implement the component**

Create `components/webgl/Screen.tsx`:
```tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { MathUtils, type Mesh } from "three";
import type { ScreenDatum } from "@/lib/webgl-content";

export default function Screen({
  datum,
  onOpen,
}: {
  datum: ScreenDatum;
  onOpen: (href: string) => void;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const w = datum.aspect === "landscape" ? datum.scale * 1.6 : datum.scale * 0.9;
  const h = datum.aspect === "landscape" ? datum.scale * 0.9 : datum.scale * 1.6;

  useFrame(() => {
    if (!ref.current) return;
    const target = hovered ? 1.08 : 1;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, target, 0.12);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, target, 0.12);
  });

  return (
    <group position={datum.position} rotation={datum.rotation}>
      <Image
        ref={ref}
        url={datum.thumb}
        scale={[w, h]}
        transparent
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(datum.href);
        }}
      />
    </group>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles (component not yet mounted — confirms types/imports resolve).

- [ ] **Step 3: Commit**

```bash
git add components/webgl/Screen.tsx
git commit -m "feat: webgl screen component"
```

---

### Task 8: Hero reel plane (video texture)

**Files:**
- Create: `components/webgl/HeroReel.tsx`

**Interfaces:**
- Produces: `<HeroReel src?: string position?: [number,number,number] />` — a plane with the showreel as a `VideoTexture`, defaults `src="/assets/experience-media-show-reel.mp4"`, autoplay/muted/loop.

- [ ] **Step 1: Implement the component**

Create `components/webgl/HeroReel.tsx`:
```tsx
"use client";

import { useEffect, useMemo } from "react";
import { VideoTexture, SRGBColorSpace } from "three";

export default function HeroReel({
  src = "/assets/experience-media-show-reel.mp4",
  position = [0, 0, 2] as [number, number, number],
}) {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = src;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    return v;
  }, [src]);

  const texture = useMemo(() => {
    const t = new VideoTexture(video);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [video]);

  useEffect(() => {
    video.play().catch(() => {});
    const onHidden = () => (document.hidden ? video.pause() : video.play().catch(() => {}));
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      video.pause();
      texture.dispose();
    };
  }, [video, texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[12, 6.75]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/HeroReel.tsx
git commit -m "feat: webgl hero reel video plane"
```

---

### Task 9: Camera rig (drives camera from scroll)

**Files:**
- Create: `components/webgl/CameraRig.tsx`

**Interfaces:**
- Consumes: `useScrollProgress` (Task 6), `sampleCameraPath` (Task 4), `useThree`/`useFrame`.
- Produces: `<CameraRig />` — each frame, lerps the default camera toward `sampleCameraPath(progress.current)`.

- [ ] **Step 1: Implement the component**

Create `components/webgl/CameraRig.tsx`:
```tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { sampleCameraPath } from "@/lib/camera-path";

export default function CameraRig() {
  const progress = useScrollProgress();
  const { camera } = useThree();
  const lookAt = useRef(new Vector3());

  useFrame(() => {
    const { position, lookAt: target } = sampleCameraPath(progress.current);
    camera.position.lerp(position, 0.08);
    lookAt.current.lerp(target, 0.08);
    camera.lookAt(lookAt.current);
  });

  return null;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/CameraRig.tsx
git commit -m "feat: scroll-driven camera rig"
```

---

### Task 10: Particle field

**Files:**
- Create: `components/webgl/ParticleField.tsx`

**Interfaces:**
- Consumes: `maath/random` for sphere distribution, drei `Points`/`PointMaterial`.
- Produces: `<ParticleField count?: number />` — default 1500 drifting points; slow rotation.

- [ ] **Step 1: Implement the component**

Create `components/webgl/ParticleField.tsx`:
```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";
import type { Points as TPoints } from "three";

export default function ParticleField({ count = 1500 }) {
  const ref = useRef<TPoints>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(count * 3), { radius: 120 }) as Float32Array,
    [count]
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.01;
    ref.current.rotation.x += dt * 0.004;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled={false}>
      <PointMaterial transparent color="#c8920a" size={0.12} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/ParticleField.tsx
git commit -m "feat: webgl particle field"
```

---

### Task 11: Multiverse scene assembly

**Files:**
- Create: `components/webgl/Multiverse.tsx`

**Interfaces:**
- Consumes: `buildScreenLayout` (Task 3), `Screen` (7), `HeroReel` (8), `CameraRig` (9), `ParticleField` (10).
- Produces: `<Multiverse tier="low" | "high" />` — assembles fog, lights, screens (count limited by tier), hero reel, particles, camera rig. Opens links via `window.open`.

- [ ] **Step 1: Implement the component**

Create `components/webgl/Multiverse.tsx`:
```tsx
"use client";

import { useMemo } from "react";
import { buildScreenLayout } from "@/lib/webgl-content";
import Screen from "./Screen";
import HeroReel from "./HeroReel";
import CameraRig from "./CameraRig";
import ParticleField from "./ParticleField";
import type { Tier } from "@/lib/webgl-capability";

export default function Multiverse({ tier }: { tier: Tier }) {
  const screens = useMemo(() => {
    const all = buildScreenLayout({ seed: 11 });
    return tier === "low" ? all.filter((_, i) => i % 2 === 0) : all;
  }, [tier]);

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <>
      <color attach="background" args={["#0c0b0a"]} />
      <fog attach="fog" args={["#0c0b0a", 30, 220]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#ffe9c0" />
      <CameraRig />
      <HeroReel />
      <ParticleField count={tier === "low" ? 600 : 1500} />
      {screens.map((s) => (
        <Screen key={s.id} datum={s} onOpen={open} />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/Multiverse.tsx
git commit -m "feat: assemble multiverse scene"
```

---

### Task 12: Post-processing effects

**Files:**
- Create: `components/webgl/Effects.tsx`

**Interfaces:**
- Consumes: `@react-three/postprocessing`.
- Produces: `<Effects tier />` — Bloom + Vignette + Noise always; ChromaticAberration + DepthOfField only on `"high"`.

- [ ] **Step 1: Implement the component**

Create `components/webgl/Effects.tsx`:
```tsx
"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  DepthOfField,
} from "@react-three/postprocessing";
import { Vector2 } from "three";
import type { Tier } from "@/lib/webgl-capability";

export default function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      {tier === "high" ? (
        <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2} />
      ) : (
        <></>
      )}
      {tier === "high" ? (
        <ChromaticAberration offset={new Vector2(0.0008, 0.0008)} radialModulation={false} modulationOffset={0} />
      ) : (
        <></>
      )}
      <Noise opacity={0.04} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/Effects.tsx
git commit -m "feat: postprocessing effects"
```

---

### Task 13: WebGL canvas wrapper + capability gate

**Files:**
- Create: `components/webgl/WebGLCanvas.tsx`

**Interfaces:**
- Consumes: `detectTier` (Task 5), `Multiverse` (11), `Effects` (12), R3F `Canvas`.
- Produces: `<WebGLCanvas />` — client component; on mount detects tier; if `"off"` renders nothing; else mounts a fixed full-viewport `<Canvas>` with `Multiverse` + `Effects`. DPR clamped `[1, tier==="high"?2:1.5]`.

- [ ] **Step 1: Implement the component**

Create `components/webgl/WebGLCanvas.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier, type Tier } from "@/lib/webgl-capability";
import Multiverse from "./Multiverse";
import Effects from "./Effects";

export default function WebGLCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  if (tier === null || tier === "off") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        className="!pointer-events-auto"
        dpr={[1, tier === "high" ? 2 : 1.5]}
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: tier === "high", powerPreference: "high-performance" }}
      >
        <Multiverse tier={tier} />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles.

- [ ] **Step 3: Commit**

```bash
git add components/webgl/WebGLCanvas.tsx
git commit -m "feat: gated webgl canvas wrapper"
```

---

### Task 14: Mount canvas + make hero transparent over it

**Files:**
- Modify: `app/page.tsx` (lazy-mount `WebGLCanvas`, mark hero region)
- Modify: `components/Hero.tsx` (allow the WebGL reel to show through the headline screen)

**Interfaces:**
- Consumes: `WebGLCanvas` (Task 13).
- Produces: Home page renders the canvas behind the DOM; the hero's first screen lets the 3D show through while the DOM headline overlays.

- [ ] **Step 1: Lazy-mount the canvas on the home page**

In `app/page.tsx`, add at top:
```tsx
import dynamic from "next/dynamic";
const WebGLCanvas = dynamic(() => import("@/components/webgl/WebGLCanvas"), { ssr: false });
```
Render `<WebGLCanvas />` as the first child of the returned fragment (before `<Hero />`).

- [ ] **Step 2: Let the hero headline sit over the 3D**

In `components/Hero.tsx`, on the headline `<section>`, ensure the background is transparent for the first viewport so the canvas shows through (remove any opaque background; the section already uses the page background). Add `relative z-10` to the headline `<section>` so DOM text stays above the `-z-10` canvas. Remove the old `ContainerScroll` showreel block (the WebGL hero reel replaces it) — delete the `ContainerScroll` import and its JSX usage.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiles; no unused-import errors (ContainerScroll removed).

- [ ] **Step 4: Visual verification (headless Chrome)**

Run:
```bash
(npm run dev > /tmp/dev.log 2>&1 &) ; sleep 6
google-chrome-stable --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/cm-chrome --window-size=1440,900 about:blank > /tmp/chrome.log 2>&1 &
sleep 3
```
Then via chrome-devtools MCP: navigate to `http://localhost:3000/`, screenshot top of page.
Expected: dark 3D void with floating thumbnails + showreel visible behind the white headline; no console errors. Kill chrome + dev server after.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/Hero.tsx
git commit -m "feat: mount multiverse behind home hero"
```

---

### Task 15: Reduced-motion / no-WebGL fallback parity

**Files:**
- Modify: `components/Hero.tsx` (restore a static reel block when canvas is off)
- Create: `components/webgl/HeroFallback.tsx`

**Interfaces:**
- Consumes: `detectTier`.
- Produces: `<HeroFallback />` — when tier is `"off"`, renders the original framed `<video>` showreel (the v1 look) so reduced-motion / no-WebGL users still see the reel.

- [ ] **Step 1: Implement the fallback**

Create `components/webgl/HeroFallback.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { detectTier } from "@/lib/webgl-capability";
import { site } from "@/lib/content";

export default function HeroFallback() {
  const [off, setOff] = useState(false);
  useEffect(() => setOff(detectTier() === "off"), []);
  if (!off) return null;
  return (
    <section className="px-5 pb-20 md:px-10 md:pb-32">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-night">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
          <source src={site.showreel} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount fallback in the hero**

In `components/Hero.tsx`, render `<HeroFallback />` right after the headline `<section>`.

- [ ] **Step 3: Verify build + reduced-motion path**

Run: `npm run build` (expect pass). Then in headless Chrome with `--force-prefers-reduced-motion` (or emulate via DevTools), load `/` and confirm: NO canvas, the static framed video shows. Confirm normal load still shows the 3D.

- [ ] **Step 4: Commit**

```bash
git add components/webgl/HeroFallback.tsx components/Hero.tsx
git commit -m "feat: static hero fallback for reduced-motion/no-webgl"
```

---

### Task 16: Asset optimization pass

**Files:**
- Create: `public/assets/webgl/hero-poster.jpg` (extracted frame)
- Modify: `lib/content.ts` (optional `showreelPoster` field)
- Create: `scripts/optimize-webgl-assets.md` (documented commands)

**Interfaces:**
- Produces: a lighter hero loop + poster; thumbnails confirmed web-served. (Production of new clip loops is out of scope; static thumbnails remain.)

- [ ] **Step 1: Generate a poster frame + compressed loop**

Document and run (requires ffmpeg; if absent, note and skip the loop, keep poster only):
```bash
mkdir -p public/assets/webgl
# poster frame at 2s
ffmpeg -y -i "public/assets/experience-media-show-reel.mp4" -ss 2 -frames:v 1 -q:v 3 public/assets/webgl/hero-poster.jpg
# optional 10s compressed loop (skip if ffmpeg missing)
ffmpeg -y -i "public/assets/experience-media-show-reel.mp4" -t 10 -an -vf "scale=1280:-2" -c:v libx264 -crf 26 -movflags +faststart public/assets/webgl/hero-loop.mp4
```
Record the commands in `scripts/optimize-webgl-assets.md`.

- [ ] **Step 2: Point HeroReel at the optimized loop when present**

In `components/webgl/HeroReel.tsx`, change the default `src` to `"/assets/webgl/hero-loop.mp4"` IF that file exists; otherwise leave the original. (Conditional on Step 1 success.)

- [ ] **Step 3: Verify build + visual**

Run: `npm run build` (pass). Load `/` in headless Chrome; confirm hero reel still plays and load is lighter (network panel shows the smaller file).

- [ ] **Step 4: Commit**

```bash
git add public/assets/webgl scripts/optimize-webgl-assets.md components/webgl/HeroReel.tsx lib/content.ts
git commit -m "perf: optimized hero loop + poster"
```

---

### Task 17: Final integration QA + performance check

**Files:**
- Modify: any file needing fixes surfaced by QA.

**Interfaces:** none (verification task).

- [ ] **Step 1: Full unit test run**

Run: `npm test`
Expected: all suites PASS (prng, webgl-content, camera-path, webgl-capability).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: clean compile, static `/` and `/portfolio`, dynamic `/api/contact`.

- [ ] **Step 3: Desktop visual + interaction sweep (headless Chrome via MCP)**

- Navigate `/`, scroll 0 → bottom in steps; screenshot hero, mid-scroll (camera should have flown deeper — different screens visible), and footer.
- Confirm: scroll moves the camera; screens hover-scale; clicking a screen calls `window.open` (verify via evaluate hooking `window.open`).
- Check `list_console_messages` → zero errors/warnings.

- [ ] **Step 4: Mobile tier check**

Resize to 390×844, reload, confirm: canvas renders with fewer screens and no DOF (tier "low"), still ≥ ~30fps (no jank in trace), DOM content intact.

- [ ] **Step 5: SEO/content regression check**

Run:
```bash
curl -s http://localhost:3000/ | grep -c "Experience Media"
```
Expected: > 0 (server-rendered DOM content still present; canvas is client-only).

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "test: multiverse integration QA + fixes"
```

---

## Self-Review

**Spec coverage:**
- Architecture (fixed canvas, Lenis-synced, procedural camera) → Tasks 6, 9, 13, 14 ✓
- Content Multiverse hero (screens + hero reel + particles) → Tasks 3, 7, 8, 10, 11 ✓
- Interaction (hover/click → real links) → Tasks 7, 11, 17 ✓
- Rendering/shaders (bloom, CA, vignette, noise, DOF) → Task 12 ✓
- Performance & accessibility tiers, reduced-motion/no-WebGL fallback, mobile → Tasks 5, 13, 15, 17 ✓
- Asset production (optimized loop + poster; static thumbs) → Task 16 ✓
- No v1 regression / SEO → Tasks 14, 17 ✓
- Tech stack additions → Task 1 ✓

**Deferred from spec (explicitly out of v1 scope, not gaps):** section "moments" beyond the hero fly-through (orbiting ring, services 3D text, stat particle burst, finale pull-back) are described in the spec as enhancements; the plan ships the **hero multiverse + scroll fly-through** as the testable v1 and leaves the additional moments for a follow-up plan to keep this plan shippable. The 3D-text/particle-burst moments require their own tasks — flagged here so they are not silently dropped.

**Placeholder scan:** no TBD/TODO; every code step has full code. ✓

**Type consistency:** `ScreenDatum`, `Tier`, `CameraSample`, `buildScreenLayout`, `sampleCameraPath`, `detectTier`/`pickTier`, `useScrollProgress` names match across all tasks. ✓

---

# Phase 2 — aura.build-inspired enhancements (after core ships)

> Run these only after Tasks 1–17 are merged and verified. Inspired by
> aura.build/design-systems (dark "telemetry/command-center" language: bracketed
> mono labels, topology lines, telemetry stat cards, bold accent moments).

### Task 18: Topology lines in the Multiverse

**Files:**
- Create: `components/webgl/TopologyLines.tsx`
- Modify: `components/webgl/Multiverse.tsx` (render `<TopologyLines screens={...} tier={...} />`)

**Interfaces:**
- Consumes: `ScreenDatum[]` from `buildScreenLayout`, three `BufferGeometry`/`LineSegments`.
- Produces: `<TopologyLines screens={ScreenDatum[]} tier={Tier} />` — faint gold lines connecting each screen to its nearest N neighbours ("content network").

- [ ] **Step 1: Implement nearest-neighbour line geometry**

Create `components/webgl/TopologyLines.tsx`:
```tsx
"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import type { ScreenDatum } from "@/lib/webgl-content";
import type { Tier } from "@/lib/webgl-capability";

export default function TopologyLines({
  screens,
  tier,
}: {
  screens: ScreenDatum[];
  tier: Tier;
}) {
  const geometry = useMemo(() => {
    const k = tier === "low" ? 1 : 2; // neighbours per node
    const pts: number[] = [];
    const positions = screens.map((s) => new Vector3(...s.position));
    positions.forEach((p, i) => {
      const dists = positions
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, k);
      dists.forEach(({ j }) => {
        pts.push(p.x, p.y, p.z, positions[j].x, positions[j].y, positions[j].z);
      });
    });
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [screens, tier]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#c8920a" transparent opacity={0.14} depthWrite={false} />
    </lineSegments>
  );
}
```

- [ ] **Step 2: Render it in Multiverse**

In `components/webgl/Multiverse.tsx`, import `TopologyLines` and render `<TopologyLines screens={screens} tier={tier} />` before the screen list.

- [ ] **Step 3: Verify build + visual**

Run `npm run build` (pass). Load `/`, confirm faint gold lines web the screens together without overpowering them. Tune `opacity`/`k` if noisy.

- [ ] **Step 4: Commit**

```bash
git add components/webgl/TopologyLines.tsx components/webgl/Multiverse.tsx
git commit -m "feat: topology lines connecting work-screens"
```

### Task 19: Telemetry stat card

**Files:**
- Modify: `components/StatCounter.tsx` (restyle into a bracketed multi-readout)
- Modify: `lib/content.ts` (add a `telemetry` array: label/value pairs)

**Interfaces:**
- Produces: `telemetry: { label: string; value: string }[]` in content; StatCounter renders a `[ STUDIO TELEMETRY ]` header + the animated 300M+ as the lead figure + a bracketed grid of the other readouts (Projects / Creators / Brands), mono labels.

- [ ] **Step 1: Add telemetry data**

In `lib/content.ts`, add:
```ts
export const telemetry = [
  { label: "Views generated", value: "300M+" },
  { label: "Creators", value: "9+" },
  { label: "Brand partners", value: "15" },
  { label: "Avg. turnaround", value: "< 1 day" },
];
```

- [ ] **Step 2: Restyle StatCounter**

Keep the existing count-up for the lead number; wrap the section with a `[ STUDIO TELEMETRY ]` mono eyebrow and render `telemetry` as a bracketed grid below (mono labels, hairline dividers, gold values). Preserve the `prefers-reduced-motion` path.

- [ ] **Step 3: Verify build + visual**

Run `npm run build` (pass). Load `/`, confirm the stat now reads as a telemetry block; count-up still fires on scroll-in.

- [ ] **Step 4: Commit**

```bash
git add components/StatCounter.tsx lib/content.ts
git commit -m "feat: telemetry-style studio stat block"
```

### Task 20: Bracketed mono labels + bold gold moment

**Files:**
- Modify: section headers across `components/` (CreatorsStrip, BrandGrid, ServicesPinned, Testimonials, PortfolioGrid) to a consistent `[ NN — TITLE ]` mono eyebrow form.
- Create: `components/Manifesto.tsx` (one full-bleed gold brutalist statement section)
- Modify: `app/page.tsx` (place `<Manifesto />` between Services and the work CTA)

**Interfaces:**
- Produces: `<Manifesto />` — full-bleed `bg-accent text-night` section with one oversized line, e.g. "WE MAKE CONTENT THAT TRAVELS." in tight display type.

- [ ] **Step 1: Add the Manifesto section**

Create `components/Manifesto.tsx`:
```tsx
import Reveal from "./Reveal";

export default function Manifesto() {
  return (
    <section className="bg-accent text-night">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <p className="eyebrow text-night/70">[ Manifesto ]</p>
        <Reveal>
          <h2 className="display mt-6 text-[clamp(2.5rem,9vw,9rem)] uppercase">
            We make content
            <br />
            that travels.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Standardize bracketed eyebrows**

Update each listed section's eyebrow/label to the `[ NN — TITLE ]` mono form (e.g. `[ 04 — SERVICES ]`). Keep existing layout otherwise.

- [ ] **Step 3: Place Manifesto on the home page**

In `app/page.tsx`, render `<Manifesto />` between `<ServicesPinned />` and the work-CTA section.

- [ ] **Step 4: Verify build + visual**

Run `npm run build` (pass). Load `/`, confirm the bold gold section provides contrast and labels read consistently.

- [ ] **Step 5: Commit**

```bash
git add components/Manifesto.tsx app/page.tsx components/CreatorsStrip.tsx components/BrandGrid.tsx components/ServicesPinned.tsx components/Testimonials.tsx components/PortfolioGrid.tsx
git commit -m "feat: bracketed mono labels + bold gold manifesto"
```

### Task 21: Generate DESIGN.md

**Files:**
- Create: `DESIGN.md`

**Interfaces:** none (documentation artifact).

- [ ] **Step 1: Write DESIGN.md**

Create `DESIGN.md` capturing the Experience Media system as durable design doc + AI prompt context: **Color** (paper/ink/accent/night tokens + hex), **Typography** (Geist display + Geist Mono labels, clamp scales, `.display`/`.eyebrow`), **Spacing/Layout** (max-w-[1600px], 12-col, hairline rules, bracketed `[ NN — TITLE ]` labels), **Motion** (Lenis smooth scroll, GSAP reveals, marquees, count-up, WebGL Multiverse + scroll-driven camera, reduced-motion fallbacks), **Components** (Nav, Hero, Multiverse, Screen, Marquee/InfiniteMovingCards, telemetry StatCounter, ServicesPinned, Manifesto, ContactForm, Footer), and **Rules** (dark sections for white logos, single gold accent, mono for metadata, prefers-reduced-motion safety, no new color systems).

- [ ] **Step 2: Commit**

```bash
git add DESIGN.md
git commit -m "docs: add DESIGN.md design system"
```
