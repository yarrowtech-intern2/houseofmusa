import { z } from "zod";

export const settingKeyValues = ["homepage-content", "contact-details", "gallery-frames", "seo"] as const;
export const mediaCategoryValues = ["product", "gallery-frame", "homepage", "misc"] as const;

export const storySectionSchema = z.object({
  eyebrow: z.string().trim().min(1).max(40),
  title: z.string().trim().min(2).max(160),
  body: z.string().trim().min(10).max(700),
  href: z.string().trim().optional().or(z.literal("")),
  linkLabel: z.string().trim().max(80).optional().or(z.literal("")),
});

export const homepageContentSchema = z.object({
  heroTitle: z.string().trim().min(2).max(120),
  heroSubtitle: z.string().trim().min(10).max(260),
  primaryCtaLabel: z.string().trim().min(2).max(60),
  secondaryCtaLabel: z.string().trim().min(2).max(60),
  secondaryCtaHref: z.string().trim().min(1).max(160),
  storySections: z.array(storySectionSchema).min(1).max(10),
});

export const contactDetailsSchema = z.object({
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  address: z.string().trim().max(260).optional().or(z.literal("")),
  whatsappUrl: z.string().trim().url().optional().or(z.literal("")),
  calendlyUrl: z.string().trim().url().optional().or(z.literal("")),
});

export const galleryFrameSchema = z.object({
  albumKey: z
    .string()
    .trim()
    .regex(/^album[1-8]$/, "Album key must be album1 through album8"),
  productSlug: z.string().trim().min(1).max(80),
  label: z.string().trim().max(80).optional().or(z.literal("")),
  enabled: z.boolean().default(true),
});

export const galleryFramesSchema = z.object({
  frames: z.array(galleryFrameSchema).length(8),
});

export const seoRouteSchema = z.object({
  path: z.string().trim().min(1).max(120),
  title: z.string().trim().min(2).max(90),
  description: z.string().trim().min(10).max(220),
  ogImage: z.string().trim().max(240).optional().or(z.literal("")),
});

export const seoSettingsSchema = z.object({
  defaultTitle: z.string().trim().min(2).max(90),
  defaultDescription: z.string().trim().min(10).max(260),
  ogImage: z.string().trim().max(240).optional().or(z.literal("")),
  routes: z.array(seoRouteSchema).max(30).default([]),
});

export const settingsUpdateSchema = z.discriminatedUnion("key", [
  z.object({ key: z.literal("homepage-content"), value: homepageContentSchema }),
  z.object({ key: z.literal("contact-details"), value: contactDetailsSchema }),
  z.object({ key: z.literal("gallery-frames"), value: galleryFramesSchema }),
  z.object({ key: z.literal("seo"), value: seoSettingsSchema }),
]);

export const mediaCreateSchema = z.object({
  url: z.string().trim().min(1).max(260),
  filename: z.string().trim().min(1).max(160),
  mimeType: z.string().trim().min(1).max(120),
  size: z.coerce.number().int().min(0),
  category: z.enum(mediaCategoryValues).default("misc"),
});

export type HomepageContentInput = z.infer<typeof homepageContentSchema>;
export type ContactDetailsInput = z.infer<typeof contactDetailsSchema>;
export type GalleryFramesInput = z.infer<typeof galleryFramesSchema>;
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
export type MediaCreateInput = z.infer<typeof mediaCreateSchema>;
