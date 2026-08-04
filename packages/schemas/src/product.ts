import { z } from "zod";
import { projectTypeValues } from "./contact";

export const productCategoryValues = projectTypeValues.filter((v) => v !== "other") as [
  Exclude<(typeof projectTypeValues)[number], "other">,
  ...Exclude<(typeof projectTypeValues)[number], "other">[],
];

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase kebab-case"),
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(4000),
  category: z.enum(productCategoryValues),
  techStack: z.array(z.string().trim().min(1)).min(1).max(30),
  // Empty until a real asset is uploaded — the product card renders a
  // brand-gradient placeholder in that case rather than requiring a
  // fabricated stock image.
  coverImage: z.string().trim().default(""),
  gallery: z.array(z.string().trim().min(1)).default([]),
  caseStudyUrl: z.string().url().optional().or(z.literal("")),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export const productUpdateSchema = productSchema.partial();
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  category: z.enum(productCategoryValues).optional(),
  search: z.string().trim().max(120).optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
