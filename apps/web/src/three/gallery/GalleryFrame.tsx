"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, MeshStandardMaterial, Object3D, SpotLight } from "three";
import type { Product } from "@houseofmusa/types";
import type { FrameAnchor } from "@/lib/galleryLayout";
import { FRAME_GLOW_RADIUS } from "@/lib/galleryLayout";
import type { DeviceTier } from "@/hooks/useDeviceTier";

const COVER_GRADIENTS: Record<string, string> = {
  erp: "#FF6F00",
  saas: "#2F78ED",
  "enterprise-software": "#1a1a1a",
  "custom-software": "#FF6F00",
  "ai-infrastructure": "#2F78ED",
  "digital-transformation": "#1a1a1a",
  "cloud-solutions": "#2F78ED",
  "web-mobile": "#FF6F00",
};

export function GalleryFrame({
  anchor,
  product,
  playerPositionRef,
  tier,
}: {
  anchor: FrameAnchor;
  product: Product;
  playerPositionRef: MutableRefObject<THREE.Vector3>;
  tier: DeviceTier;
}) {
  const moldingRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const spotRef = useRef<SpotLight>(null);
  const spotTargetRef = useRef<Object3D>(null);
  const anchorVec = useRef(new THREE.Vector3(...anchor.position));
  const color = COVER_GRADIENTS[product.category] ?? "#FF6F00";

  // The spotlight's `target` is a separate Object3D — for it to inherit
  // this group's position/rotation (so the light actually points at the
  // artwork rather than the world origin) it has to be wired up explicitly
  // once both refs exist, not via a "target-position" prop.
  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;
    const distance = anchorVec.current.distanceTo(
      new THREE.Vector3(playerPositionRef.current.x, anchor.position[1], playerPositionRef.current.z),
    );
    const proximity = THREE.MathUtils.clamp(1 - distance / FRAME_GLOW_RADIUS, 0, 1);
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.1, 1.1, proximity);
    if (moldingRef.current) {
      const scale = 1 + proximity * 0.015;
      moldingRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={anchor.position} rotation={[0, anchor.rotationY, 0]}>
      {/* Walnut molding */}
      <mesh ref={moldingRef}>
        <planeGeometry args={[1.5, 1.05]} />
        <meshStandardMaterial color="#3d2a1c" roughness={0.5} />
      </mesh>
      {/* "Canvas" — brand placeholder, matches the product cards on /products */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.32, 0.88]} />
        <meshStandardMaterial ref={materialRef} color={color} emissive={color} emissiveIntensity={0.1} roughness={0.55} />
      </mesh>

      {/* Museum label plaque */}
      <mesh position={[0, -0.66, 0.01]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshStandardMaterial color="#f4f2ee" roughness={0.6} />
      </mesh>

      {/* Picture light — skip on low tier */}
      <object3D ref={spotTargetRef} position={[0, 0, 0]} />
      {tier !== "low" && (
        <spotLight
          ref={spotRef}
          position={[0, 0.75, 0.6]}
          angle={0.5}
          penumbra={0.6}
          intensity={2.2}
          distance={3.5}
          color="#FFE9C7"
          castShadow={tier === "high"}
        />
      )}
    </group>
  );
}
