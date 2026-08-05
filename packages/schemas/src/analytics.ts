import { z } from "zod";

export const analyticsEventTypeValues = [
  "page-view",
  "contact-submit",
  "application-submit",
  "product-view",
  "gallery-visit",
] as const;

export const analyticsEventSchema = z.object({
  type: z.enum(analyticsEventTypeValues),
  path: z.string().trim().min(1).max(300),
  meta: z.record(z.unknown()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
