"use client";

import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, MeshStandardMaterial, Object3D, SpotLight } from "three";
import type { Product } from "@hausofmusa/types";
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

function createProjectTexture(product: Product): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const color = COVER_GRADIENTS[product.category] ?? "#FF6F00";
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#111111");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(56, 56, canvas.width - 112, canvas.height - 112);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(0, 0, canvas.width, 10);
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 76px Arial, sans-serif";
  const words = product.name.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > 780 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  lines.slice(0, 2).forEach((line, index) => ctx.fillText(line, 88, 92 + index * 84));

  ctx.font = "500 34px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  const tagline = product.tagline.length > 86 ? `${product.tagline.slice(0, 83)}...` : product.tagline;
  ctx.fillText(tagline, 88, 308);

  ctx.font = "600 28px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.fillText(product.category.replaceAll("-", " ").toUpperCase(), 88, 510);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

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
  const projectTexture = useMemo(() => createProjectTexture(product), [product]);

  useEffect(() => {
    return () => projectTexture.dispose();
  }, [projectTexture]);

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
        <planeGeometry args={[2.85, 1.9]} />
        <meshStandardMaterial color="#3d2a1c" roughness={0.5} />
      </mesh>
      {/* "Canvas" — brand placeholder, matches the product cards on /products */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.62, 1.62]} />
        <meshStandardMaterial
          ref={materialRef}
          map={projectTexture}
          color="#ffffff"
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.55}
        />
      </mesh>

      {/* Museum label plaque */}
      <mesh position={[0, -1.08, 0.01]}>
        <planeGeometry args={[0.9, 0.2]} />
        <meshStandardMaterial color="#f4f2ee" roughness={0.6} />
      </mesh>

      {/* Picture light — skip on low tier */}
      <object3D ref={spotTargetRef} position={[0, 0, 0]} />
      {tier !== "low" && (
        <spotLight
          ref={spotRef}
          position={[0, 1.2, 0.75]}
          angle={0.5}
          penumbra={0.6}
          intensity={2.4}
          distance={4.2}
          color="#FFE9C7"
          castShadow={tier === "high"}
        />
      )}
    </group>
  );
}
