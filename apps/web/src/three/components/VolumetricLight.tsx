"use client";

import { DoubleSide } from "three";

/** Cheap fake volumetric light ray — an additive-blended cone, not a raymarch. */
export function VolumetricLight() {
  return (
    <mesh position={[-6, 8, -4]} rotation={[0, 0, Math.PI / 5]}>
      <coneGeometry args={[3, 14, 24, 1, true]} />
      <meshBasicMaterial color="#FFDCA8" transparent opacity={0.05} depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}
