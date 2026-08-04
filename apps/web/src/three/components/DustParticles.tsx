"use client";

import { Sparkles } from "@react-three/drei";
import type { DeviceTier } from "@/hooks/useDeviceTier";

const COUNT_BY_TIER: Record<DeviceTier, number> = { low: 0, mid: 60, high: 140 };

export function DustParticles({ tier }: { tier: DeviceTier }) {
  const count = COUNT_BY_TIER[tier];
  if (count === 0) return null;

  return (
    <Sparkles
      count={count}
      scale={[14, 6, 14]}
      position={[0, 3, 2]}
      size={1.5}
      speed={0.15}
      opacity={0.35}
      color="#FFEBD1"
    />
  );
}
