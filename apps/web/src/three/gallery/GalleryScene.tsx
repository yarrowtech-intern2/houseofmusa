"use client";

import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Product } from "@hausofmusa/types";
import { FirstPersonRig, type MoveInput, type LookDelta, type Orientation } from "./FirstPersonRig";
import { ModelGalleryEnvironment } from "./ModelGalleryEnvironment";
import { GalleryFrame } from "./GalleryFrame";
import { InteractionCameraTween } from "./InteractionCameraTween";
import { FRAME_ANCHORS, SPAWN_POSITION, SPAWN_YAW, ROOM } from "@/lib/galleryLayout";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function GalleryScene({
  products,
  isTouchDevice,
  activeFrameIndex,
  isReturning,
  moveInputRef,
  lookDeltaRef,
  onLockChange,
  onNearbyFrameChange,
  onReturnComplete,
}: {
  products: Product[];
  isTouchDevice: boolean;
  activeFrameIndex: number | null;
  /** True from the moment the detail panel closes until the tween back to the player completes. */
  isReturning: boolean;
  moveInputRef: MutableRefObject<MoveInput>;
  lookDeltaRef: MutableRefObject<LookDelta>;
  onLockChange: (locked: boolean) => void;
  onNearbyFrameChange: (index: number | null) => void;
  onReturnComplete: () => void;
}) {
  const tier = useDeviceTier();
  const playerPositionRef = useRef(new THREE.Vector3(...SPAWN_POSITION));
  const orientationRef = useRef<Orientation>({ yaw: SPAWN_YAW, pitch: 0 });
  // Stays paused through the tween back too, so the rig doesn't snap the
  // camera to the player's position out from under the return animation.
  const paused = activeFrameIndex !== null || isReturning;

  return (
    <Canvas
      shadows={tier !== "low"}
      dpr={tier === "high" ? [1, 2] : [1, 1.25]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      camera={{ fov: 62, near: 0.1, far: 70, position: SPAWN_POSITION }}
    >
      <color attach="background" args={["#0f0f0f"]} />
      {/* Subtle — mainly softens the far clip edge, not meant to read as visible indoor haze. */}
      <fog attach="fog" args={["#0f0f0f", ROOM.halfDepth * 1.8, ROOM.halfDepth * 2.8]} />

      <ambientLight intensity={0.65} />
      <directionalLight
        position={[6, ROOM.wallHeight - 0.5, -4]}
        intensity={0.45}
        color="#FFF6E6"
        castShadow={tier !== "low"}
        shadow-mapSize={tier === "high" ? [1024, 1024] : [512, 512]}
      />

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.2} />
        <ModelGalleryEnvironment tier={tier} />
        {FRAME_ANCHORS.map((anchor, index) => {
          const product = products[index % products.length];
          if (!product) return null;
          return (
            <GalleryFrame
              key={index}
              anchor={anchor}
              product={product}
              playerPositionRef={playerPositionRef}
              tier={tier}
            />
          );
        })}
      </Suspense>

      <FirstPersonRig
        isTouchDevice={isTouchDevice}
        paused={paused}
        onLockChange={onLockChange}
        moveInputRef={moveInputRef}
        lookDeltaRef={lookDeltaRef}
        playerPositionRef={playerPositionRef}
        orientationRef={orientationRef}
        onNearbyFrameChange={onNearbyFrameChange}
      />
      <InteractionCameraTween
        activeFrameIndex={activeFrameIndex}
        playerPositionRef={playerPositionRef}
        orientationRef={orientationRef}
        onReturnComplete={onReturnComplete}
      />

      {tier === "high" && (
        <EffectComposer>
          <Bloom intensity={0.35} luminanceThreshold={0.55} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
