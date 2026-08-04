"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { ArrowLeft, X } from "lucide-react";
import type { Product } from "@houseofmusa/types";
import { Badge, Button } from "@houseofmusa/ui";
import { CATEGORY_LABELS } from "@/lib/productCategories";
import { VirtualJoystick } from "./VirtualJoystick";
import { TouchLookArea } from "./TouchLookArea";
import type { MoveInput, LookDelta } from "@/three/gallery/FirstPersonRig";

export function GalleryUI({
  isTouchDevice,
  isLocked,
  showInstructions,
  nearbyProduct,
  activeProduct,
  moveInputRef,
  lookDeltaRef,
  onInteract,
  onClose,
}: {
  isTouchDevice: boolean;
  isLocked: boolean;
  showInstructions: boolean;
  nearbyProduct: Product | null;
  activeProduct: Product | null;
  moveInputRef: MutableRefObject<MoveInput>;
  lookDeltaRef: MutableRefObject<LookDelta>;
  onInteract: () => void;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 select-none text-white">
      {isTouchDevice && !activeProduct && <TouchLookArea lookDeltaRef={lookDeltaRef} />}

      <Link
        href="/"
        className="pointer-events-auto absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-black/60"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit Gallery
      </Link>

      {/* Desktop: prompt to click in order to engage pointer-lock look controls. */}
      {!isTouchDevice && !isLocked && !activeProduct && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/50 px-6 py-4 text-center text-sm font-medium backdrop-blur-md">
            Click anywhere to look around
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-5 py-2.5 text-xs font-medium uppercase tracking-wide backdrop-blur-md">
          {isTouchDevice ? "Drag to look · Joystick to move · Tap to view" : "WASD to move · Mouse to look · E to interact"}
        </div>
      )}

      {nearbyProduct && !activeProduct && (
        <button
          onClick={onInteract}
          className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 sm:bottom-10"
        >
          {isTouchDevice ? `View ${nearbyProduct.name}` : `Press E — View ${nearbyProduct.name}`}
        </button>
      )}

      {isTouchDevice && !activeProduct && (
        <div className="pointer-events-none absolute bottom-8 left-6">
          <VirtualJoystick moveInputRef={moveInputRef} />
        </div>
      )}

      {activeProduct && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 sm:pb-10">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-black/70 p-6 shadow-soft-lg backdrop-blur-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="primary">{CATEGORY_LABELS[activeProduct.category] ?? activeProduct.category}</Badge>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white">
                  {activeProduct.name}
                </h2>
                <p className="mt-1 text-sm text-white/60">{activeProduct.tagline}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close (Esc)"
                className="shrink-0 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">{activeProduct.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {activeProduct.techStack.slice(0, 6).map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/60">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href={`/products/${activeProduct.slug}`}>View Full Details</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close (Esc)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
