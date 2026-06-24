"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Vector2 } from "three";
import type { Tier } from "@/lib/webgl-capability";

// Lightweight post stack — Bloom + Vignette everywhere, a touch of chromatic
// aberration on high tier. (DepthOfField/Noise removed: too costly for the gain.)
export default function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.65}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      {tier === "high" ? (
        <ChromaticAberration offset={new Vector2(0.0006, 0.0006)} />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.3} darkness={0.55} />
    </EffectComposer>
  );
}
