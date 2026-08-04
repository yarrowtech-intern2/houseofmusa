"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";

const RADIUS = 44;

export function VirtualJoystick({ moveInputRef }: { moveInputRef: MutableRefObject<{ x: number; y: number }> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const nubRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  const setNub = (x: number, y: number) => {
    if (nubRef.current) nubRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointerId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    setNub(dx, dy);
    moveInputRef.current = { x: dx / RADIUS, y: -dy / RADIUS };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    setNub(0, 0);
    moveInputRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="pointer-events-auto relative h-28 w-28 touch-none rounded-full border border-white/25 bg-black/25 backdrop-blur-md"
      aria-label="Move"
    >
      <div
        ref={nubRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-soft"
      />
    </div>
  );
}
