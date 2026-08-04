import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, FileText, ArrowLeft } from "lucide-react";
import type { Product, PaginatedResult } from "@houseofmusa/types";
import { Button, Badge } from "@houseofmusa/ui";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/productCategories";
import { STATIC_PRODUCTS } from "@/lib/staticContent";

async function getProduct(slug: string): Promise<Product | null> {
  const staticProduct = STATIC_PRODUCTS.find((product) => product.slug === slug) ?? null;

  if (!CAN_USE_API) return staticProduct;

  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`);
    if (res.status === 404) return staticProduct;
    if (!res.ok) throw new Error(`Failed to load product: ${res.status}`);
    const data = (await res.json()) as { item: Product };
    return data.item;
  } catch {
    return staticProduct;
  }
}

// Static export needs every path known at build time — no server-side
// fallback for slugs outside this list.
export async function generateStaticParams() {
  if (!CAN_USE_API) return STATIC_PRODUCTS.map((product) => ({ slug: product.slug }));

  try {
    const res = await fetch(`${API_URL}/api/products?pageSize=50`);
    if (!res.ok) return STATIC_PRODUCTS.map((product) => ({ slug: product.slug }));
    const data = (await res.json()) as PaginatedResult<Product>;
    return data.items.map((product) => ({ slug: product.slug }));
  } catch {
    return STATIC_PRODUCTS.map((product) => ({ slug: product.slug }));
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.tagline };
}

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

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const links = [
    { href: product.caseStudyUrl, label: "Case Study", icon: FileText },
    { href: product.liveDemoUrl, label: "Live Demo", icon: ExternalLink },
    { href: product.githubUrl, label: "GitHub", icon: Github },
  ].filter((link): link is { href: string; label: string; icon: typeof FileText } => Boolean(link.href));

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
