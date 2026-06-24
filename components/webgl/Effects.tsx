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
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      {tier === "high" ? (
        <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2} />
      ) : (
        <></>
      )}
      {tier === "high" ? (
        <ChromaticAberration offset={new Vector2(0.0008, 0.0008)} />
      ) : (
        <></>
      )}
      <Noise opacity={0.04} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  );
}
