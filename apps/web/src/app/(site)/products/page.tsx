import type { Metadata } from "next";
import type { Product, PaginatedResult } from "@houseofmusa/types";
import { apiGet } from "@/lib/api";
import { RevealText } from "@/components/motion/RevealText";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";

export const metadata: Metadata = {
  title: "Products",
  description: "ERP, SaaS, and cloud infrastructure products built by House of Musa.",
};

export default async function ProductsPage() {
  const { items: products } = await apiGet<PaginatedResult<Product>>("/api/products?pageSize=50").catch(
    () => ({ items: [] as Product[] }) as PaginatedResult<Product>,
  );

  return (
    <section className="min-h-screen px-6 pb-24 pt-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Products</span>
        <RevealText
          as="h1"
          text="Eight products, one engineering standard."
          mode="word"
          trigger="immediate"
          className="mt-4 max-w-3xl font-display text-display-lg font-medium tracking-tight text-foreground"
        />
        <p className="mt-6 max-w-xl text-base text-foreground/60">
          ERP systems, SaaS platforms, AI infrastructure, and everything between — each built and maintained
          by the same team.
        </p>

        <div className="mt-16">
          {products.length === 0 ? (
            <p className="text-sm text-foreground/50">
              Products are being added — check back shortly, or visit the admin dashboard to publish some.
            </p>
          ) : (
            <ProductsExplorer products={products} />
          )}
        </div>
      </div>
    </section>
  );
}
