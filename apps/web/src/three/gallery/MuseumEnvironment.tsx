"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { ROOM } from "@/lib/galleryLayout";
import { createMarbleTexture, createPlasterTexture } from "./proceduralTextures";
import type { DeviceTier } from "@/hooks/useDeviceTier";

const { halfWidth, halfDepth, wallHeight, balconyHeight, balconyDepth } = ROOM;

/**
 * Fully procedural "balcony museum" hall — no external model. Everything
 * here is primitive geometry + canvas-generated materials, built once
 * (memoized) rather than loaded, which also means zero network fetch for
 * the environment itself.
 */
export function MuseumEnvironment({ tier }: { tier: DeviceTier }) {
  const marbleTexture = useMemo(() => {
    const tex = createMarbleTexture();
    tex.repeat.set(halfWidth / 2, halfDepth / 2);
    return tex;
  }, []);

  const plasterTexture = useMemo(() => {
    const tex = createPlasterTexture();
    tex.repeat.set(6, 2.4);
    return tex;
  }, []);

  const columnXs = useMemo(() => [-halfWidth + 0.9, halfWidth - 0.9], []);
  const columnZs = useMemo(() => [-9, -3, 3, 9], []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, halfDepth * 2]} />
        {tier === "low" ? (
          <meshStandardMaterial map={marbleTexture} roughness={0.55} />
        ) : (
          <MeshReflectorMaterial
            map={marbleTexture}
            mirror={0.25}
            resolution={tier === "high" ? 1024 : 512}
            mixBlur={2}
            mixStrength={8}
            roughness={0.55}
            depthScale={0.4}
            minDepthThreshold={0.85}
            metalness={0.15}
          />
        )}
      </mesh>

      {/* Ceiling with a recessed skylight strip */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={[halfWidth * 2, halfDepth * 2]} />
        <meshStandardMaterial map={plasterTexture} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, wallHeight - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, halfDepth * 1.7]} />
        <meshBasicMaterial color="#fff6e6" toneMapped={false} />
      </mesh>

      {/* Perimeter walls */}
      <Wall position={[0, wallHeight / 2, halfDepth]} size={[halfWidth * 2, wallHeight]} texture={plasterTexture} />
      <Wall
        position={[0, wallHeight / 2, -halfDepth]}
        size={[halfWidth * 2, wallHeight]}
        texture={plasterTexture}
        rotationY={Math.PI}
      />
      <Wall
        position={[halfWidth, wallHeight / 2, 0]}
        size={[halfDepth * 2, wallHeight]}
        texture={plasterTexture}
        rotationY={-Math.PI / 2}
      />
      <Wall
        position={[-halfWidth, wallHeight / 2, 0]}
        size={[halfDepth * 2, wallHeight]}
        texture={plasterTexture}
        rotationY={Math.PI / 2}
      />

      {/* Balcony / mezzanine ring — architectural, not walkable */}
      <BalconyRing />

      {/* Columns along the long walls for grandeur */}
      {tier !== "low" &&
        columnXs.map((x) =>
          columnZs.map((z) => <Column key={`${x}-${z}`} position={[x, 0, z]} height={balconyHeight} />),
        )}
    </group>
  );
}

function Wall({
  position,
  size,
  texture,
  rotationY = 0,
}: {
  position: [number, number, number];
  size: [number, number];
  texture: THREE.Texture;
  rotationY?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial map={texture} roughness={0.92} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Column({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.3, 20]} />
        <meshStandardMaterial color="#f4f2ee" roughness={0.35} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, height, 20]} />
        <meshStandardMaterial color="#f7f5f1" roughness={0.3} />
      </mesh>
      <mesh position={[0, height - 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.4, 0.3, 20]} />
        <meshStandardMaterial color="#f4f2ee" roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Cantilevered mezzanine shelf + a frosted glass railing, ringing the room at balconyHeight. */
function BalconyRing() {
  const shelfInnerD = halfDepth * 2 - balconyDepth * 2;

  const segments: { position: [number, number, number]; size: [number, number] }[] = [
    { position: [0, balconyHeight, halfDepth - balconyDepth / 2], size: [halfWidth * 2, balconyDepth] },
    { position: [0, balconyHeight, -(halfDepth - balconyDepth / 2)], size: [halfWidth * 2, balconyDepth] },
    { position: [halfWidth - balconyDepth / 2, balconyHeight, 0], size: [balconyDepth, shelfInnerD] },
    { position: [-(halfWidth - balconyDepth / 2), balconyHeight, 0], size: [balconyDepth, shelfInnerD] },
  ];

  return (
    <group>
      {segments.map((seg, i) => (
        <group key={i}>
          <mesh position={seg.position} castShadow receiveShadow>
            <boxGeometry args={[seg.size[0], 0.4, seg.size[1]]} />
            <meshStandardMaterial color="#efece6" roughness={0.5} />
          </mesh>
          <mesh position={[seg.position[0], balconyHeight + 0.6, seg.position[2]]}>
            <boxGeometry args={[seg.size[0], 0.9, 0.06]} />
            <meshPhysicalMaterial
              color="#dfe6ec"
              transparent
              opacity={0.28}
              roughness={0.15}
              transmission={0.4}
              thickness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
