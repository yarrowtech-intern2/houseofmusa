"use client";

import Link from "@/components/transitions/TransitionLink";
import type { MutableRefObject } from "react";
import { ArrowLeft, Eye, Hand, HelpCircle, Keyboard, MousePointer2, Move, X } from "lucide-react";
import type { Product } from "@hausofmusa/types";
import { Badge, Button } from "@hausofmusa/ui";
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
  onShowInstructions,
  onHideInstructions,
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
  onShowInstructions: () => void;
  onHideInstructions: () => void;
}) {
  const steps = isTouchDevice
    ? [
        { icon: Move, label: "Move", detail: "Use the left joystick to walk through the gallery." },
        { icon: Eye, label: "Look", detail: "Drag anywhere on the open scene to turn the camera." },
        { icon: Hand, label: "View", detail: "Walk near a project and tap the view button." },
      ]
    : [
        { icon: Keyboard, label: "Move", detail: "Use WASD or arrow keys to walk." },
        { icon: MousePointer2, label: "Look", detail: "Click the scene, then move the mouse to look around." },
        { icon: Hand, label: "View", detail: "Press E near a project, then Esc to return." },
      ];

  return (
    <div className="pointer-events-none absolute inset-0 select-none text-white">
      {isTouchDevice && !activeProduct && <TouchLookArea lookDeltaRef={lookDeltaRef} />}

      <Link
        href="/"
        className="pointer-events-auto absolute left-3 top-3 z-10 inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 text-xs font-semibold backdrop-blur-md transition-colors hover:bg-black/65 sm:left-5 sm:top-5 sm:px-4 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Exit Gallery</span>
        <span className="sm:hidden">Exit</span>
      </Link>

      <button
        onClick={onShowInstructions}
        aria-label="Show gallery controls"
        className="pointer-events-auto absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/45 backdrop-blur-md transition-colors hover:bg-black/65 sm:right-5 sm:top-5"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {!isTouchDevice && !isLocked && !activeProduct && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="rounded-full border border-white/12 bg-black/50 px-5 py-3 text-center text-sm font-medium backdrop-blur-md">
            Click anywhere to look around
          </div>
        </div>
      )}

      {!showInstructions && !activeProduct && (
        <div className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur-md sm:flex">
          {isTouchDevice ? "Joystick to move / drag to look / tap view" : "WASD to move / mouse to look / E to view"}
        </div>
      )}

      {showInstructions && !activeProduct && (
        <div className="absolute inset-x-3 bottom-5 z-20 mx-auto max-w-md rounded-2xl border border-white/12 bg-[#111111]/90 p-4 shadow-2xl backdrop-blur-xl sm:bottom-8 sm:max-w-lg sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Gallery controls</p>
              <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Roam the project gallery
              </h1>
            </div>
            <button
              onClick={onHideInstructions}
              aria-label="Close controls tutorial"
              className="pointer-events-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {steps.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-white/65">{detail}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onHideInstructions}
            className="pointer-events-auto mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Start exploring
          </button>
        </div>
      )}

      {nearbyProduct && !activeProduct && (
        <button
          onClick={onInteract}
          className="pointer-events-auto absolute bottom-28 right-5 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 sm:bottom-10 sm:left-1/2 sm:right-auto sm:h-auto sm:w-auto sm:-translate-x-1/2 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <span className="sm:hidden">View</span>
          <span className="hidden sm:inline">
            {isTouchDevice ? `View ${nearbyProduct.name}` : `Press E - View ${nearbyProduct.name}`}
          </span>
        </button>
      )}

      {isTouchDevice && !activeProduct && !showInstructions && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
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
