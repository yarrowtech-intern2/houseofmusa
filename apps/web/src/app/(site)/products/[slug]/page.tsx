import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product } from "@hausofmusa/types";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { getProductBySlug } from "@hausofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";
import { STATIC_PRODUCTS } from "@/lib/staticContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_PRODUCTS.map((product) => ({ slug: product.slug }));
}

async function getProduct(slug: string): Promise<Product | null> {
  const staticProduct = STATIC_PRODUCTS.find((product) => product.slug === slug) ?? null;

  if (!CAN_USE_API) return staticProduct;

  try {
    return await getProductBySlug(getDb(), slug);
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
