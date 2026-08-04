"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom } from "@react-three/postprocessing";
import { HeadquartersModel } from "@/three/components/HeadquartersModel";
import { DustParticles } from "@/three/components/DustParticles";
import { VolumetricLight } from "@/three/components/VolumetricLight";
import { CameraRig } from "@/three/components/CameraRig";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { usePointerParallax } from "@/hooks/usePointerParallax";

const DPR_BY_TIER = { low: [1, 1] as [number, number], mid: [1, 1.5] as [number, number], high: [1, 2] as [number, number] };

export function HeroCanvas({
  hasModel,
  ready,
  storyContainerRef,
}: {
  hasModel: boolean;
  ready: boolean;
  storyContainerRef: RefObject<HTMLElement>;
}) {
  const tier = useDeviceTier();
  const parallaxRef = usePointerParallax();
  // DepthOfField/Bloom were tuned blind against the placeholder scale and,
  // against the real house model, washed the whole frame out. Disabled
  // until they can be retuned against a confirmed-correct base render —
  // see docs/ROADMAP.md.
  const enablePostprocessing = false;

  return (
    <Canvas
      shadows={tier !== "low"}
      dpr={DPR_BY_TIER[tier]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#EBEBEB"]} />
      <fog attach="fog" args={["#EBEBEB", 45, 100]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.4}
        color="#FFE3C2"
        castShadow={tier !== "low"}
        shadow-mapSize={tier === "high" ? [2048, 2048] : [1024, 1024]}
      />
      <directionalLight position={[-8, 4, -6]} intensity={0.3} color="#2F78ED" />

      <Suspense fallback={null}>
        <Environment preset="sunset" environmentIntensity={0.6} />
        <HeadquartersModel hasModel={hasModel} tier={tier} />
        {tier !== "low" && <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2.4} far={6} />}
        <DustParticles tier={tier} />
        {tier !== "low" && <VolumetricLight />}
      </Suspense>

      <CameraRig ready={ready} storyContainerRef={storyContainerRef} parallaxRef={parallaxRef} />

      {enablePostprocessing && (
        <EffectComposer>
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2} height={480} />
          <Bloom intensity={0.25} luminanceThreshold={0.6} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
