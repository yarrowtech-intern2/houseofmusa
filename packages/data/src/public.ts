import type { CareerRole, PaginatedResult, Product, SiteSettings } from "@hausofmusa/types";
import {
  analyticsEventSchema,
  applicationSchema,
  contactSchema,
  type AnalyticsEventInput,
  type ApplicationInput,
  type ContactInput,
  type ProductQuery,
} from "@hausofmusa/schemas";
import {
  APPLICATIONS_BUCKET,
  DataError,
  cleanSearch,
  pageRange,
  paginate,
  raise,
  safeFilename,
  type Db,
} from "./core";
import { fromContactInput, toCareerRole, toProduct } from "./mappers";

/* ---------------------------------------------------------------------------------------------
 * Reads — safe for the anon key; RLS only exposes published rows.
 * ------------------------------------------------------------------------------------------- */

export async function listProducts(
  db: Db,
  query: Partial<Pick<ProductQuery, "page" | "pageSize" | "category" | "search">> = {},
): Promise<PaginatedResult<Product>> {
  const page = { page: query.page ?? 1, pageSize: query.pageSize ?? 20 };
  const [from, to] = pageRange(page);

  let request = db
    .from("products")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.category) request = request.eq("category", query.category);
  const search = query.search ? cleanSearch(query.search) : "";
  if (search) {
    request = request.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, count, error } = await request;
  raise(error);
  return paginate((data ?? []).map(toProduct), count ?? 0, page);
}

/** Returns null when the slug does not exist (or is unpublished). */
export async function getProductBySlug(db: Db, slug: string): Promise<Product | null> {
  const { data, error } = await db.from("products").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  raise(error);
  return data ? toProduct(data) : null;
}

export async function listCareerRoles(db: Db): Promise<CareerRole[]> {
  const { data, error } = await db
    .from("career_roles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  raise(error);
  return (data ?? []).map(toCareerRole);
}

export async function getCareerRoleBySlug(db: Db, slug: string): Promise<CareerRole | null> {
  const { data, error } = await db
    .from("career_roles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  raise(error);
  return data ? toCareerRole(data) : null;
}

/** Only the settings rows that exist; callers fall back to their own defaults for the rest. */
export async function getPublicSettings(db: Db): Promise<SiteSettings> {
  const { data, error } = await db.from("settings").select("key, value");
  raise(error);
  const byKey = new Map((data ?? []).map((row: { key: string; value: unknown }) => [row.key, row.value]));
  return {
    homepageContent: byKey.get("homepage-content") as SiteSettings["homepageContent"],
    contactDetails: byKey.get("contact-details") as SiteSettings["contactDetails"],
    galleryFrames: byKey.get("gallery-frames") as SiteSettings["galleryFrames"],
    seo: byKey.get("seo") as SiteSettings["seo"],
  };
}

/* ---------------------------------------------------------------------------------------------
 * Writes — what a signed-out visitor is allowed to do (see the RLS insert policies).
 * ------------------------------------------------------------------------------------------- */

export async function submitContact(db: Db, input: ContactInput): Promise<void> {
  const parsed = contactSchema.parse(input);
  const { error } = await db.from("contacts").insert(fromContactInput(parsed));
  raise(error);
}

export async function trackEvent(db: Db, input: AnalyticsEventInput): Promise<void> {
  const parsed = analyticsEventSchema.parse(input);
  const { error } = await db.from("analytics_events").insert({
    type: parsed.type,
    path: parsed.path,
    meta: parsed.meta ?? null,
  });
  raise(error);
}

export const APPLICATION_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const APPLICATION_FILE_MAX_BYTES = 5 * 1024 * 1024;

function assertApplicationFile(file: File, label: string) {
  if (!APPLICATION_FILE_TYPES.includes(file.type)) {
    throw new DataError(400, `${label}: only PDF or Word documents are accepted`);
  }
  if (file.size > APPLICATION_FILE_MAX_BYTES) {
    throw new DataError(400, `${label}: file must be 5MB or smaller`);
  }
}

async function uploadApplicationFile(db: Db, folder: string, kind: string, file: File): Promise<string> {
  assertApplicationFile(file, kind === "resume" ? "Resume" : "Cover letter");
  const path = `${folder}/${kind}-${safeFilename(file.name)}`;
  const { error } = await db.storage.from(APPLICATIONS_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new DataError(500, `Could not upload ${kind}: ${error.message}`);
  return path;
}

export async function submitApplication(
  db: Db,
  input: Omit<ApplicationInput, "skills"> & { skills: string[] },
  files: { resume: File; coverLetter?: File | null },
): Promise<void> {
  const parsed = applicationSchema.parse(input);
  const folder = crypto.randomUUID();

  const resumePath = await uploadApplicationFile(db, folder, "resume", files.resume);
  const coverLetterPath = files.coverLetter
    ? await uploadApplicationFile(db, folder, "cover-letter", files.coverLetter)
    : null;

  const { error } = await db.from("applications").insert({
    role_id: parsed.roleId,
    full_name: parsed.fullName,
    email: parsed.email,
    phone: parsed.phone,
    resume_url: resumePath,
    cover_letter_url: coverLetterPath,
    linkedin_url: parsed.linkedinUrl || null,
    github_url: parsed.githubUrl || null,
    portfolio_url: parsed.portfolioUrl || null,
    expected_salary: parsed.expectedSalary || null,
    experience_years: parsed.experienceYears,
    skills: parsed.skills,
    availability: parsed.availability,
  });
  if (error?.code === "23503") throw new DataError(404, "Selected role no longer exists");
  raise(error);
}
