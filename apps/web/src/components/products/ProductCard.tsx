"use client";

import Link from "next/link";
import type { Product } from "@houseofmusa/types";
import { Badge } from "@houseofmusa/ui";
import { TiltCard } from "@/components/motion/TiltCard";
import { CATEGORY_LABELS } from "@/lib/productCategories";

// Deterministic per-category gradient so the placeholder cover (no real
// asset yet) still reads as intentional, not a broken image.
const COVER_GRADIENTS: Record<string, string> = {
  erp: "from-primary via-primary/70 to-secondary",
  saas: "from-secondary via-secondary/70 to-primary",
  "enterprise-software": "from-foreground via-foreground/70 to-secondary",
  "custom-software": "from-primary via-foreground/60 to-foreground",
  "ai-infrastructure": "from-secondary via-foreground/70 to-primary",
  "digital-transformation": "from-foreground via-primary/60 to-primary",
  "cloud-solutions": "from-secondary via-primary/50 to-secondary",
  "web-mobile": "from-primary via-secondary/60 to-secondary",
};

export function ProductCard({ product }: { product: Product }) {
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <TiltCard className="h-full" maxTilt={4}>
      <Link
        href={`/products/${product.slug}`}
        className="group flex aspect-[3/4] h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] border border-foreground/5 bg-[#f5f5f5] shadow-[0_16px_36px_rgba(15,15,15,0.08)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-foreground/10 hover:shadow-[0_24px_52px_rgba(15,15,15,0.14)]"
      >
        <div
          className={`relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${
            COVER_GRADIENTS[product.category] ?? "from-primary to-secondary"
          }`}
        >
          {product.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.coverImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <span className="font-display text-4xl font-semibold text-white/90 sm:text-6xl">
              {product.name.charAt(0)}
            </span>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.12))] opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/20 transition-[box-shadow] duration-300 group-hover:ring-white/40" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-6">
          <Badge
            variant="primary"
            className="w-fit border-primary/5 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary sm:text-xs"
          >
            {categoryLabel}
          </Badge>
          <h3 className="mt-3 line-clamp-1 font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/60 sm:text-sm">{product.tagline}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3 sm:pt-4">
            {product.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/10 bg-white/40 px-2 py-1 text-[10px] leading-none text-foreground/50 last:hidden sm:px-2.5 sm:text-xs sm:last:inline-flex"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
