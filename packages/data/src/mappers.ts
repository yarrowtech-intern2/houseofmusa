import type {
  AnalyticsEvent,
  Application,
  CareerRole,
  Contact,
  Media,
  Product,
} from "@houseofmusa/types";
import type { CareerRoleInput, ContactInput, ProductInput } from "@houseofmusa/schemas";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const optional = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

const base = (row: Row) => ({
  _id: row.id as string,
  createdAt: row.created_at as string,
  updatedAt: row.updated_at as string,
});

export function toProduct(row: Row): Product {
  return {
    ...base(row),
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    techStack: row.tech_stack ?? [],
    coverImage: row.cover_image ?? "",
    gallery: row.gallery ?? [],
    caseStudyUrl: optional(row.case_study_url),
    liveDemoUrl: optional(row.live_demo_url),
    githubUrl: optional(row.github_url),
    featured: row.featured,
    order: row.order,
    published: row.published,
  };
}

/** Accepts full or partial input; only keys that are present are written. */
export function fromProductInput(input: Partial<ProductInput>): Row {
  const row: Row = {};
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.name !== undefined) row.name = input.name;
  if (input.tagline !== undefined) row.tagline = input.tagline;
  if (input.description !== undefined) row.description = input.description;
  if (input.category !== undefined) row.category = input.category;
  if (input.techStack !== undefined) row.tech_stack = input.techStack;
  if (input.coverImage !== undefined) row.cover_image = input.coverImage;
  if (input.gallery !== undefined) row.gallery = input.gallery;
  if (input.caseStudyUrl !== undefined) row.case_study_url = input.caseStudyUrl || null;
  if (input.liveDemoUrl !== undefined) row.live_demo_url = input.liveDemoUrl || null;
  if (input.githubUrl !== undefined) row.github_url = input.githubUrl || null;
  if (input.featured !== undefined) row.featured = input.featured;
  if (input.order !== undefined) row.order = input.order;
  if (input.published !== undefined) row.published = input.published;
  return row;
}

export function toCareerRole(row: Row): CareerRole {
  return {
    ...base(row),
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    published: row.published,
  };
}

export function fromCareerRoleInput(input: Partial<CareerRoleInput>): Row {
  const row: Row = {};
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.title !== undefined) row.title = input.title;
  if (input.department !== undefined) row.department = input.department;
  if (input.location !== undefined) row.location = input.location;
  if (input.employmentType !== undefined) row.employment_type = input.employmentType;
  if (input.description !== undefined) row.description = input.description;
  if (input.responsibilities !== undefined) row.responsibilities = input.responsibilities;
  if (input.requirements !== undefined) row.requirements = input.requirements;
  if (input.published !== undefined) row.published = input.published;
  return row;
}

export function toContact(row: Row): Contact {
  return {
    ...base(row),
    name: row.name,
    email: row.email,
    phone: optional(row.phone),
    company: optional(row.company),
    budget: row.budget,
    projectType: row.project_type,
    message: row.message,
    status: row.status,
  };
}

export function fromContactInput(input: Partial<ContactInput> & { status?: Contact["status"] }): Row {
  const row: Row = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.email !== undefined) row.email = input.email;
  if (input.phone !== undefined) row.phone = input.phone || null;
  if (input.company !== undefined) row.company = input.company || null;
  if (input.budget !== undefined) row.budget = input.budget;
  if (input.projectType !== undefined) row.project_type = input.projectType;
  if (input.message !== undefined) row.message = input.message;
  if (input.status !== undefined) row.status = input.status;
  return row;
}

export function toApplication(row: Row): Application {
  return {
    ...base(row),
    roleId: row.role_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    resumeUrl: row.resume_url,
    coverLetterUrl: optional(row.cover_letter_url),
    linkedinUrl: optional(row.linkedin_url),
    githubUrl: optional(row.github_url),
    portfolioUrl: optional(row.portfolio_url),
    expectedSalary: optional(row.expected_salary),
    experienceYears: Number(row.experience_years),
    skills: row.skills ?? [],
    availability: row.availability,
    status: row.status,
  };
}

export function toMedia(row: Row): Media {
  return {
    ...base(row),
    filename: row.filename,
    url: row.url,
    mimeType: row.mime_type,
    size: Number(row.size),
    category: row.category,
  };
}

export function toAnalyticsEvent(row: Row): AnalyticsEvent {
  return {
    ...base(row),
    type: row.type,
    path: row.path,
    meta: row.meta ?? undefined,
  };
}
