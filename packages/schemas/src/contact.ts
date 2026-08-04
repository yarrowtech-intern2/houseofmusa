import { z } from "zod";

export const contactBudgetValues = ["under-10k", "10k-50k", "50k-150k", "150k-plus", "not-sure"] as const;

export const projectTypeValues = [
  "erp",
  "saas",
  "enterprise-software",
  "custom-software",
  "ai-infrastructure",
  "digital-transformation",
  "cloud-solutions",
  "web-mobile",
  "other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.enum(contactBudgetValues, { errorMap: () => ({ message: "Select a budget range" }) }),
  projectType: z.enum(projectTypeValues, { errorMap: () => ({ message: "Select a project type" }) }),
  message: z.string().trim().min(10, "Tell us a little more about your project").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
