"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";

/** Full-screen drag-to-look surface for touch — sits behind the joystick/buttons in z-order. */
export function TouchLookArea({ lookDeltaRef }: { lookDeltaRef: MutableRefObject<{ dx: number; dy: number }> }) {
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const activePointerId = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointerId.current = e.pointerId;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId || !lastPos.current) return;
    lookDeltaRef.current.dx += e.clientX - lastPos.current.x;
    lookDeltaRef.current.dy += e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    lastPos.current = null;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute inset-0 touch-none"
      aria-hidden
    />
  );
}
