"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import type { DeviceTier } from "@/hooks/useDeviceTier";

export const GALLERY_MODEL_PATH = "/models/gallery2.glb";
const DRACO_DECODER_PATH = "/draco/gltf/";

export function ModelGalleryEnvironment({ tier }: { tier: DeviceTier }) {
  const { scene } = useGLTF(GALLERY_MODEL_PATH, DRACO_DECODER_PATH);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = tier !== "low";
        child.receiveShadow = true;
      }
    });
  }, [scene, tier]);

  return <primitive object={scene} />;
}

useGLTF.preload(GALLERY_MODEL_PATH, DRACO_DECODER_PATH);
