"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productCategoryValues } from "@houseofmusa/schemas";
import type { Product } from "@houseofmusa/types";
import { Button, Input, Label, Textarea } from "@houseofmusa/ui";
import { ApiRequestError, apiFetch } from "@/lib/api";

// Mirrors @houseofmusa/schemas' productSchema but keeps techStack as a raw
// comma-separated string for a plain text input — split into an array only
// when building the API payload.
const productFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase kebab-case only (e.g. atlas-erp)"),
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(4000),
  category: z.enum(productCategoryValues),
  techStack: z.string().trim().min(1, "List at least one technology"),
  caseStudyUrl: z.string().trim().url().optional().or(z.literal("")),
  liveDemoUrl: z.string().trim().url().optional().or(z.literal("")),
  githubUrl: z.string().trim().url().optional().or(z.literal("")),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.coerce.number().int(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          slug: product.slug,
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          category: product.category,
          techStack: product.techStack.join(", "),
          caseStudyUrl: product.caseStudyUrl ?? "",
          liveDemoUrl: product.liveDemoUrl ?? "",
          githubUrl: product.githubUrl ?? "",
          featured: product.featured,
          published: product.published,
          order: product.order,
        }
      : { featured: false, published: true, order: 0, techStack: "" },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      techStack: values.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing && product) {
        await apiFetch(`/api/products/${product._id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/products", { method: "POST", body: JSON.stringify(payload) });
      }
      router.push("/products");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <span className="text-xs text-red-500">{errors.slug.message}</span>}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" {...register("tagline")} />
        {errors.tagline && <span className="text-xs text-red-500">{errors.tagline.message}</span>}
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            {productCategoryValues.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" {...register("order")} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
        <Input id="techStack" placeholder="Node.js, PostgreSQL, React" {...register("techStack")} />
        {errors.techStack && <span className="text-xs text-red-500">{errors.techStack.message}</span>}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="caseStudyUrl">Case Study URL</Label>
          <Input id="caseStudyUrl" {...register("caseStudyUrl")} />
          {errors.caseStudyUrl && <span className="text-xs text-red-500">{errors.caseStudyUrl.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="liveDemoUrl">Live Demo URL</Label>
          <Input id="liveDemoUrl" {...register("liveDemoUrl")} />
          {errors.liveDemoUrl && <span className="text-xs text-red-500">{errors.liveDemoUrl.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" {...register("githubUrl")} />
          {errors.githubUrl && <span className="text-xs text-red-500">{errors.githubUrl.message}</span>}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground/70 dark:text-white/70">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-foreground/20" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/70 dark:text-white/70">
          <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-foreground/20" />
          Published
        </label>
      </div>

      {serverError && <p className="mt-4 text-sm text-red-500">{serverError}</p>}

      <div className="mt-8 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
