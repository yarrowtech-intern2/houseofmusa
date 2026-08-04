import { z } from "zod";

export const employmentTypeValues = ["full-time", "part-time", "contract", "internship", "remote"] as const;

export const careerRoleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase kebab-case"),
  title: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  employmentType: z.enum(employmentTypeValues),
  description: z.string().trim().min(10).max(4000),
  responsibilities: z.array(z.string().trim().min(1)).default([]),
  requirements: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().default(true),
});

export type CareerRoleInput = z.infer<typeof careerRoleSchema>;

export const careerRoleUpdateSchema = careerRoleSchema.partial();
export type CareerRoleUpdateInput = z.infer<typeof careerRoleUpdateSchema>;

export const applicationSchema = z.object({
  roleId: z.string().trim().min(1, "A role must be selected"),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(5).max(30),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  expectedSalary: z.string().trim().max(60).optional().or(z.literal("")),
  experienceYears: z.coerce.number().min(0).max(60),
  skills: z.array(z.string().trim().min(1)).min(1, "List at least one skill"),
  availability: z.string().trim().min(2).max(120),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const applicationStatusValues = [
  "new",
  "reviewing",
  "interviewing",
  "offered",
  "rejected",
  "hired",
] as const;

export const applicationStatusSchema = z.object({
  status: z.enum(applicationStatusValues),
});

export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>;
