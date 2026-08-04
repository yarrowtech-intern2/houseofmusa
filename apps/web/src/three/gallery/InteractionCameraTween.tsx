"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";
import { EYE_HEIGHT, FRAME_ANCHORS, FRAME_VIEW_DISTANCE } from "@/lib/galleryLayout";
import type { Orientation } from "./FirstPersonRig";

export function InteractionCameraTween({
  activeFrameIndex,
  playerPositionRef,
  orientationRef,
  onReturnComplete,
}: {
  activeFrameIndex: number | null;
  playerPositionRef: MutableRefObject<THREE.Vector3>;
  orientationRef: MutableRefObject<Orientation>;
  onReturnComplete: () => void;
}) {
  const { camera } = useThree();
  const wasActive = useRef(false);

  useEffect(() => {
    const tweenState = { x: camera.position.x, y: camera.position.y, z: camera.position.z, yaw: 0, pitch: 0 };
    // Read current rotation into the tween state so either direction starts from wherever the camera actually is.
    tweenState.yaw = camera.rotation.y;
    tweenState.pitch = camera.rotation.x;

    const anchor = activeFrameIndex !== null ? FRAME_ANCHORS[activeFrameIndex] : undefined;

    if (anchor) {
      wasActive.current = true;
      const normal = new THREE.Vector3(Math.sin(anchor.rotationY), 0, Math.cos(anchor.rotationY));
      const viewpoint = new THREE.Vector3(...anchor.position).add(normal.multiplyScalar(FRAME_VIEW_DISTANCE));

      gsap.to(tweenState, {
        x: viewpoint.x,
        y: viewpoint.y,
        z: viewpoint.z,
        yaw: anchor.rotationY,
        pitch: 0,
        duration: 1.1,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.position.set(tweenState.x, tweenState.y, tweenState.z);
          camera.rotation.set(tweenState.pitch, tweenState.yaw, 0);
        },
      });
    } else if (wasActive.current) {
      wasActive.current = false;
      const player = playerPositionRef.current;

      gsap.to(tweenState, {
        x: player.x,
        y: EYE_HEIGHT,
        z: player.z,
        yaw: orientationRef.current.yaw,
        pitch: orientationRef.current.pitch,
        duration: 0.9,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.position.set(tweenState.x, tweenState.y, tweenState.z);
          camera.rotation.set(tweenState.pitch, tweenState.yaw, 0);
        },
        onComplete: onReturnComplete,
      });
    }
  }, [activeFrameIndex, camera, playerPositionRef, orientationRef, onReturnComplete]);

  return null;
}
