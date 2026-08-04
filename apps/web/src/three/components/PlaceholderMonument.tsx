"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import type { DeviceTier } from "@/hooks/useDeviceTier";

/**
 * Stand-in for the real headquarters .glb (see public/models/README.md).
 * Abstract stepped massing + a reflective floor — enough geometry, material
 * response, and silhouette to validate lighting/camera/scroll work before
 * the real asset arrives. Swapped out automatically once the file exists.
 */
interface Volume {
  position: [number, number, number];
  size: [number, number, number];
}

export function PlaceholderMonument({ tier }: { tier: DeviceTier }) {
  const volumes = useMemo<Volume[]>(
    () => [
      { position: [0, 1, 0], size: [6, 2, 4] },
      { position: [-2.2, 2.4, -0.6], size: [2.6, 2.8, 2.6] },
      { position: [2, 1.9, 0.8], size: [2, 1.8, 2] },
      { position: [0.6, 3.6, -1.2], size: [1.6, 2, 1.6] },
    ],
    [],
  );

  return (
    <group>
      {volumes.map((volume, index) => (
        <mesh key={index} position={volume.position} castShadow receiveShadow>
          <boxGeometry args={volume.size} />
          <meshPhysicalMaterial
            color="#f4f4f2"
            roughness={0.35}
            metalness={0.1}
            clearcoat={0.4}
            clearcoatRoughness={0.6}
          />
        </mesh>
      ))}

      {/* Warm lit-window accent strips, dusk-facade feel */}
      {volumes.slice(1).map((volume, index) => (
        <mesh
          key={`window-${index}`}
          position={[volume.position[0], volume.position[1], volume.position[2] + volume.size[2] / 2 + 0.01]}
        >
          <planeGeometry args={[volume.size[0] * 0.6, 0.12]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#FF6F00" : "#2F78ED"} toneMapped={false} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        {tier === "low" ? (
          <meshStandardMaterial color="#dedcd8" roughness={0.9} />
        ) : (
          <MeshReflectorMaterial
            mirror={0.4}
            resolution={tier === "high" ? 1024 : 512}
            mixBlur={1}
            mixStrength={30}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#e4e2de"
            metalness={0.2}
          />
        )}
      </mesh>
    </group>
  );
}
