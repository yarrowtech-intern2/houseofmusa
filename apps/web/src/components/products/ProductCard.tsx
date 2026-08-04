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
  return (
    <TiltCard>
      <Link
        href={`/products/${product.slug}`}
        className="group block overflow-hidden rounded-3xl border border-foreground/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-soft-lg"
      >
        <div
          className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${
            COVER_GRADIENTS[product.category] ?? "from-primary to-secondary"
          }`}
        >
          {product.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-6xl font-semibold text-white/90">{product.name.charAt(0)}</span>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 transition-[box-shadow] duration-300 group-hover:ring-2 group-hover:ring-white/40" />
        </div>

        <div className="p-6">
          <Badge variant="primary">{CATEGORY_LABELS[product.category] ?? product.category}</Badge>
          <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm text-foreground/60">{product.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/10 px-2.5 py-1 text-xs text-foreground/50"
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
