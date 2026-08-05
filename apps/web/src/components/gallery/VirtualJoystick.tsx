"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

const RADIUS = 28;

export function VirtualJoystick({ moveInputRef }: { moveInputRef: MutableRefObject<{ x: number; y: number }> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const nubRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  const setNub = (x: number, y: number) => {
    if (nubRef.current) {
      nubRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  };

  const setMoveFromPointer = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }

    setNub(dx, dy);
    moveInputRef.current = { x: dx / RADIUS, y: -dy / RADIUS };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setMoveFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    setMoveFromPointer(e.clientX, e.clientY);
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
      className="pointer-events-auto relative h-[76px] w-[76px] touch-none rounded-full border border-white/45 bg-[radial-gradient(circle_at_35%_28%,#5f5f5f_0%,#2f2f2f_42%,#151515_100%)] shadow-[inset_-7px_-6px_4px_rgba(0,0,0,0.43),inset_7px_5px_15px_rgba(255,255,255,0.4),0_12px_26px_rgba(0,0,0,0.38)] backdrop-blur-md"
      aria-label="Move"
    >
      <ChevronUp className="pointer-events-none absolute left-1/2 top-1 h-3.5 w-3.5 -translate-x-1/2 text-white/90" />
      <ChevronDown className="pointer-events-none absolute bottom-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 text-white/90" />
      <ChevronLeft className="pointer-events-none absolute left-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/90" />
      <ChevronRight className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/90" />
      <div
        ref={nubRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 rounded-full bg-[#d9d9d9] shadow-[inset_0_2px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(0,0,0,0.18),0_6px_12px_rgba(0,0,0,0.35)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
