// Shared domain types — mirror the Mongoose schemas in apps/api/src/models.
// Kept dependency-free so both Next.js apps and the API can import from here.

export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectType =
  | "erp"
  | "saas"
  | "enterprise-software"
  | "custom-software"
  | "ai-infrastructure"
  | "digital-transformation"
  | "cloud-solutions"
  | "web-mobile";

export interface Product extends BaseDocument {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectType;
  techStack: string[];
  coverImage: string;
  gallery: string[];
  caseStudyUrl?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
}

export type EmploymentType = "full-time" | "part-time" | "contract" | "internship" | "remote";

export interface CareerRole extends BaseDocument {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities: string[];
  requirements: string[];
  published: boolean;
}

export type ApplicationStatus = "new" | "reviewing" | "interviewing" | "offered" | "rejected" | "hired";

export interface Application extends BaseDocument {
  roleId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: string;
  experienceYears: number;
  skills: string[];
  availability: string;
  status: ApplicationStatus;
}

export type ContactBudget = "under-10k" | "10k-50k" | "50k-150k" | "150k-plus" | "not-sure";

export interface Contact extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget: ContactBudget;
  projectType: ProjectType | "other";
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
}

export type AdminRole = "super-admin" | "editor" | "recruiter";

export interface Admin extends BaseDocument {
  name: string;
  email: string;
  role: AdminRole;
}

export interface AnalyticsEvent extends BaseDocument {
  type: "page-view" | "contact-submit" | "application-submit" | "product-view" | "gallery-visit";
  path: string;
  meta?: Record<string, unknown>;
}

export interface Media extends BaseDocument {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  category: "product" | "gallery-frame" | "homepage" | "misc";
}

export interface Setting extends BaseDocument {
  key: string;
  value: unknown;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}
