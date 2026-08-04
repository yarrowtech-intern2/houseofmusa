"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EYE_HEIGHT, FRAME_ANCHORS, INTERACT_DISTANCE, MOVE_SPEED, WALK_BOUNDS } from "@/lib/galleryLayout";

const LOOK_SENSITIVITY_MOUSE = 0.0024;
const LOOK_SENSITIVITY_TOUCH = 0.006;
const MAX_PITCH = Math.PI / 2 - 0.12;

export interface MoveInput {
  x: number; // strafe, -1..1
  y: number; // forward/back, -1..1
}

export interface LookDelta {
  dx: number;
  dy: number;
}

export interface Orientation {
  yaw: number;
  pitch: number;
}

export function FirstPersonRig({
  isTouchDevice,
  paused,
  onLockChange,
  moveInputRef,
  lookDeltaRef,
  playerPositionRef,
  orientationRef,
  onNearbyFrameChange,
}: {
  isTouchDevice: boolean;
  paused: boolean;
  onLockChange?: (locked: boolean) => void;
  moveInputRef: MutableRefObject<MoveInput>;
  lookDeltaRef: MutableRefObject<LookDelta>;
  /** Shared with GalleryFrame instances so their proximity glow needs no React state/re-renders. */
  playerPositionRef: MutableRefObject<THREE.Vector3>;
  /** Shared with the interaction camera tween, so it can resume exactly where the rig left off. */
  orientationRef: MutableRefObject<Orientation>;
  /** Fires only when the "in interact range" frame actually changes, not every frame. */
  onNearbyFrameChange: (index: number | null) => void;
}) {
  const { camera, gl } = useThree();
  const keys = useRef({ forward: false, backward: false, left: false, right: false });
  const lastNearby = useRef<number | null>(null);

  useEffect(() => {
    camera.rotation.order = "YXZ";
  }, [camera]);

  // Desktop: keyboard + pointer lock mouse-look.
  useEffect(() => {
    if (isTouchDevice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
      }
    };

    const canvas = gl.domElement;
    const requestLock = () => {
      if (!paused) canvas.requestPointerLock();
    };
    const handleLockChange = () => onLockChange?.(document.pointerLockElement === canvas);
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      orientationRef.current.yaw -= e.movementX * LOOK_SENSITIVITY_MOUSE;
      orientationRef.current.pitch = THREE.MathUtils.clamp(
        orientationRef.current.pitch - e.movementY * LOOK_SENSITIVITY_MOUSE,
        -MAX_PITCH,
        MAX_PITCH,
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("click", requestLock);
    document.addEventListener("pointerlockchange", handleLockChange);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("click", requestLock);
      document.removeEventListener("pointerlockchange", handleLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
  }, [isTouchDevice, gl, paused, onLockChange, orientationRef]);

  useFrame((_, delta) => {
    if (paused) return;
    const position = playerPositionRef.current;

    if (isTouchDevice) {
      orientationRef.current.yaw -= lookDeltaRef.current.dx * LOOK_SENSITIVITY_TOUCH;
      orientationRef.current.pitch = THREE.MathUtils.clamp(
        orientationRef.current.pitch - lookDeltaRef.current.dy * LOOK_SENSITIVITY_TOUCH,
        -MAX_PITCH,
        MAX_PITCH,
      );
      lookDeltaRef.current.dx = 0;
      lookDeltaRef.current.dy = 0;
    }

    const moveX = isTouchDevice
      ? moveInputRef.current.x
      : (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    const moveY = isTouchDevice
      ? moveInputRef.current.y
      : (keys.current.forward ? 1 : 0) - (keys.current.backward ? 1 : 0);

    if (moveX !== 0 || moveY !== 0) {
      const magnitude = Math.min(1, Math.hypot(moveX, moveY));
      // Three.js camera looks down -Z at yaw 0, so world-space forward is
      // (-sin(yaw), 0, -cos(yaw)) — not (sin, 0, cos).
      const forward = new THREE.Vector3(-Math.sin(orientationRef.current.yaw), 0, -Math.cos(orientationRef.current.yaw));
      const right = new THREE.Vector3(-forward.z, 0, forward.x);
      const step = forward
        .multiplyScalar(moveY)
        .add(right.multiplyScalar(moveX))
        .normalize()
        .multiplyScalar(magnitude * MOVE_SPEED * delta);

      position.x = THREE.MathUtils.clamp(position.x + step.x, WALK_BOUNDS.minX, WALK_BOUNDS.maxX);
      position.z = THREE.MathUtils.clamp(position.z + step.z, WALK_BOUNDS.minZ, WALK_BOUNDS.maxZ);
    }

    camera.position.set(position.x, EYE_HEIGHT, position.z);
    camera.rotation.set(orientationRef.current.pitch, orientationRef.current.yaw, 0);

    let nearbyIndex: number | null = null;
    let nearbyDistance = Infinity;
    FRAME_ANCHORS.forEach((anchor, index) => {
      const distance = Math.hypot(anchor.position[0] - position.x, anchor.position[2] - position.z);
      if (distance < nearbyDistance) {
        nearbyDistance = distance;
        nearbyIndex = index;
      }
    });
    const inRangeIndex = nearbyDistance <= INTERACT_DISTANCE ? nearbyIndex : null;
    if (inRangeIndex !== lastNearby.current) {
      lastNearby.current = inRangeIndex;
      onNearbyFrameChange(inRangeIndex);
    }
  });

  return null;
}
