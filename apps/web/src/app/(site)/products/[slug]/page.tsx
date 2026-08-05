import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product } from "@houseofmusa/types";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { STATIC_PRODUCTS } from "@/lib/staticContent";

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<Product | null> {
  const staticProduct = STATIC_PRODUCTS.find((product) => product.slug === slug) ?? null;

  if (!CAN_USE_API) return staticProduct;

  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load product: ${res.status}`);
    const data = (await res.json()) as { item: Product };
    return data.item;
  } catch {
    return staticProduct;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetailClient initialProduct={product} />;
}
