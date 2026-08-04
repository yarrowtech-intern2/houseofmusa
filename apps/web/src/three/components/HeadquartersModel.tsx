"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { Mesh } from "three";
import { PlaceholderMonument } from "./PlaceholderMonument";
import type { DeviceTier } from "@/hooks/useDeviceTier";

export const HOUSE_MODEL_PATH = "/models/house.glb";

function RealHeadquartersModel() {
  const { scene } = useGLTF(HOUSE_MODEL_PATH);
  const ref = useRef<Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // house.glb bundles the house together with two huge background/terrain
  // meshes (~2700 units deep, centered ~1300 units from the export origin).
  // The house cluster itself (walls/floors/balcony/roof nodes) sits tightly
  // around local (x≈-2, z≈27), and is ~15-16 units wide — roughly 2-3x
  // wider than the camera waypoints (tuned for a ~6-8 unit placeholder)
  // expect, which is why the first pass (translate only, scale 1) filled
  // the whole frame at point-blank range. HOUSE_SCALE brings it down to
  // that assumed size; position is `-HOUSE_SCALE * localCenter` so the
  // house's center lands at world origin *after* scaling (position is
  // applied in the parent's/world space, unaffected by this object's own
  // scale). Derived by walking the glTF scene graph's actual world
  // transforms, not guessed — but still unreviewed in-browser at this
  // exact scale. Adjust HOUSE_SCALE/position, and the y-offset if the base
  // doesn't sit flush with y=0, once you've seen it rendered.
  const HOUSE_SCALE = 0.45;
  const localCenter = { x: -2, y: 0, z: 27.2 };
  return (
    <primitive
      ref={ref}
      object={scene}
      scale={HOUSE_SCALE}
      position={[-HOUSE_SCALE * localCenter.x, -HOUSE_SCALE * localCenter.y, -HOUSE_SCALE * localCenter.z]}
    />
  );
}

/**
 * `hasModel` is resolved server-side (fs.existsSync) in the page component —
 * see public/models/README.md. Keeps the loader from ever attempting to
 * fetch a file we already know is absent.
 */
export function HeadquartersModel({ hasModel, tier }: { hasModel: boolean; tier: DeviceTier }) {
  if (hasModel) return <RealHeadquartersModel />;
  return <PlaceholderMonument tier={tier} />;
}
