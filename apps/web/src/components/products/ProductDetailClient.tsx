"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Github, type LucideIcon } from "lucide-react";
import type { Product } from "@houseofmusa/types";
import { Badge, Button } from "@houseofmusa/ui";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { RevealText } from "@/components/motion/RevealText";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/productCategories";

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

type ProductLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (!CAN_USE_API) return;

    let cancelled = false;

    fetch(`${API_URL}/api/products/${initialProduct.slug}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load product: ${res.status}`);
        return res.json() as Promise<{ item: Product }>;
      })
      .then((data) => {
        if (!cancelled) setProduct(data.item);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [initialProduct.slug]);

  const links = useMemo(
    () =>
      [
        { href: product.caseStudyUrl, label: "Case Study", icon: FileText },
        { href: product.liveDemoUrl, label: "Live Demo", icon: ExternalLink },
        { href: product.githubUrl, label: "GitHub", icon: Github },
      ].filter((link): link is ProductLink => Boolean(link.href)),
    [product.caseStudyUrl, product.githubUrl, product.liveDemoUrl],
  );

  return (
    <article className="min-h-screen pb-24 pt-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All products
        </Link>

        <div className="mt-6">
          <Badge variant="primary">{CATEGORY_LABELS[product.category] ?? product.category}</Badge>
          <RevealText
            as="h1"
            text={product.name}
            mode="word"
            trigger="immediate"
            className="mt-4 font-display text-display-lg font-semibold tracking-tight text-foreground"
          />
          <p className="mt-4 max-w-2xl text-lg text-foreground/60">{product.tagline}</p>
        </div>

        <div
          className={`relative mt-10 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${
            COVER_GRADIENTS[product.category] ?? "from-primary to-secondary"
          }`}
        >
          {product.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.coverImage} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-8xl font-semibold text-white/90">{product.name.charAt(0)}</span>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Overview
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70">{product.description}</p>

            {links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {links.map((link) => (
                  <MagneticButton key={link.label}>
                    <Button variant="outline" asChild>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    </Button>
                  </MagneticButton>
                ))}
              </div>
            )}
          </div>

          <div className="sm:w-56">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Tech Stack
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
