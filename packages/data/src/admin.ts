import type {
  ApplicationStatus,
  CareerRole,
  Contact,
  Media,
  PaginatedResult,
  Product,
  SiteSettings,
} from "@hausofmusa/types";
import type { z } from "zod";
import {
  applicationStatusSchema,
  careerRoleSchema,
  careerRoleUpdateSchema,
  contactAdminUpdateSchema,
  contactStatusSchema,
  mediaCreateSchema,
  productSchema,
  productUpdateSchema,
  settingKeyValues,
  settingsUpdateSchema,
  type ProductQuery,
} from "@hausofmusa/schemas";
import {
  APPLICATIONS_BUCKET,
  DataError,
  MEDIA_BUCKET,
  cleanSearch,
  pageRange,
  paginate,
  raise,
  safeFilename,
  type Db,
} from "./core";
import {
  fromCareerRoleInput,
  fromContactInput,
  fromProductInput,
  toApplication,
  toCareerRole,
  toContact,
  toMedia,
  toProduct,
} from "./mappers";
import { defaultSettings, type SettingKey } from "./defaults";
import type { AnalyticsSummary, ApplicationWithRole, DashboardSummary } from "./types";

/* Everything here expects a client carrying an admin's session; RLS rejects anyone else. */

/* ------------------------------------------------ products */

export async function listProductsAdmin(
  db: Db,
  query: Partial<Pick<ProductQuery, "page" | "pageSize" | "category" | "search">> = {},
): Promise<PaginatedResult<Product>> {
  const page = { page: query.page ?? 1, pageSize: query.pageSize ?? 20 };
  const [from, to] = pageRange(page);

  let request = db
    .from("products")
    .select("*", { count: "exact" })
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

export async function getProductById(db: Db, id: string): Promise<Product> {
  const { data, error } = await db.from("products").select("*").eq("id", id).maybeSingle();
  raise(error);
  if (!data) throw new DataError(404, "Product not found");
  return toProduct(data);
}

export async function createProduct(db: Db, input: z.input<typeof productSchema>): Promise<Product> {
  const parsed = productSchema.parse(input);
  const { data, error } = await db.from("products").insert(fromProductInput(parsed)).select().single();
  raise(error, "A product with this slug already exists");
  return toProduct(data);
}

export async function updateProduct(db: Db, id: string, input: z.input<typeof productUpdateSchema>): Promise<Product> {
  const parsed = productUpdateSchema.parse(input);
  const { data, error } = await db.from("products").update(fromProductInput(parsed)).eq("id", id).select().single();
  raise(error, "A product with this slug already exists");
  return toProduct(data);
}

export async function deleteProduct(db: Db, id: string): Promise<void> {
  const { error } = await db.from("products").delete().eq("id", id);
  raise(error);
}

/* ------------------------------------------------ career roles */

export async function listCareerRolesAdmin(db: Db): Promise<CareerRole[]> {
  const { data, error } = await db.from("career_roles").select("*").order("created_at", { ascending: false });
  raise(error);
  return (data ?? []).map(toCareerRole);
}

export async function getCareerRoleById(db: Db, id: string): Promise<CareerRole> {
  const { data, error } = await db.from("career_roles").select("*").eq("id", id).maybeSingle();
  raise(error);
  if (!data) throw new DataError(404, "Role not found");
  return toCareerRole(data);
}

export async function createCareerRole(db: Db, input: z.input<typeof careerRoleSchema>): Promise<CareerRole> {
  const parsed = careerRoleSchema.parse(input);
  const { data, error } = await db.from("career_roles").insert(fromCareerRoleInput(parsed)).select().single();
  raise(error, "A role with this slug already exists");
  return toCareerRole(data);
}

export async function updateCareerRole(
  db: Db,
  id: string,
  input: z.input<typeof careerRoleUpdateSchema>,
): Promise<CareerRole> {
  const parsed = careerRoleUpdateSchema.parse(input);
  const { data, error } = await db
    .from("career_roles")
    .update(fromCareerRoleInput(parsed))
    .eq("id", id)
    .select()
    .single();
  raise(error, "A role with this slug already exists");
  return toCareerRole(data);
}

export async function deleteCareerRole(db: Db, id: string): Promise<void> {
  const { error } = await db.from("career_roles").delete().eq("id", id);
  raise(error);
}

/* ------------------------------------------------ contacts */

export async function listContacts(
  db: Db,
  query: { page?: number; pageSize?: number; status?: string; search?: string } = {},
): Promise<PaginatedResult<Contact>> {
  const page = { page: query.page ?? 1, pageSize: Math.min(query.pageSize ?? 20, 100) };
  const [from, to] = pageRange(page);

  let request = db
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.status) request = request.eq("status", query.status);
  const search = query.search ? cleanSearch(query.search) : "";
  if (search) {
    request = request.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,message.ilike.%${search}%`,
    );
  }

  const { data, count, error } = await request;
  raise(error);
  return paginate((data ?? []).map(toContact), count ?? 0, page);
}

export async function getContactById(db: Db, id: string): Promise<Contact> {
  const { data, error } = await db.from("contacts").select("*").eq("id", id).maybeSingle();
  raise(error);
  if (!data) throw new DataError(404, "Contact not found");
  return toContact(data);
}

export async function updateContactStatus(db: Db, id: string, status: Contact["status"]): Promise<Contact> {
  contactStatusSchema.parse({ status });
  const { data, error } = await db.from("contacts").update({ status }).eq("id", id).select().single();
  raise(error);
  return toContact(data);
}

export async function updateContact(
  db: Db,
  id: string,
  input: z.input<typeof contactAdminUpdateSchema>,
): Promise<Contact> {
  const parsed = contactAdminUpdateSchema.parse(input);
  const { data, error } = await db.from("contacts").update(fromContactInput(parsed)).eq("id", id).select().single();
  raise(error);
  return toContact(data);
}

/* ------------------------------------------------ applications */

const APPLICATION_SELECT = "*, role:career_roles(id, title, department)";
const FILE_URL_TTL_SECONDS = 60 * 60;

type RoleJoin = { id: string; title: string; department: string } | null;

function toApplicationWithRole(row: Record<string, unknown>): ApplicationWithRole {
  const { role, ...rest } = row as Record<string, unknown> & { role?: RoleJoin };
  const application = toApplication(rest);
  return {
    ...application,
    roleId: role ? { _id: role.id, title: role.title, department: role.department } : null,
  };
}

/** Replaces storage paths on each application with short-lived signed download URLs. */
async function signApplicationFiles(db: Db, items: ApplicationWithRole[]): Promise<ApplicationWithRole[]> {
  const paths = items.flatMap((item) => [item.resumeUrl, item.coverLetterUrl].filter((p): p is string => Boolean(p)));
  if (paths.length === 0) return items;

  const { data, error } = await db.storage.from(APPLICATIONS_BUCKET).createSignedUrls(paths, FILE_URL_TTL_SECONDS);
  raise(error);
  const signed = new Map((data ?? []).map((entry) => [entry.path, entry.signedUrl]));

  return items.map((item) => ({
    ...item,
    resumeUrl: signed.get(item.resumeUrl) ?? "",
    coverLetterUrl: item.coverLetterUrl ? (signed.get(item.coverLetterUrl) ?? undefined) : undefined,
  }));
}

export async function listApplications(
  db: Db,
  query: { page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<ApplicationWithRole>> {
  const page = { page: query.page ?? 1, pageSize: Math.min(query.pageSize ?? 20, 100) };
  const [from, to] = pageRange(page);

  const { data, count, error } = await db
    .from("applications")
    .select(APPLICATION_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  raise(error);

  const items = await signApplicationFiles(db, (data ?? []).map(toApplicationWithRole));
  return paginate(items, count ?? 0, page);
}

export async function updateApplicationStatus(
  db: Db,
  id: string,
  status: ApplicationStatus,
): Promise<ApplicationWithRole> {
  applicationStatusSchema.parse({ status });
  const { data, error } = await db
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select(APPLICATION_SELECT)
    .single();
  raise(error);
  return toApplicationWithRole(data);
}

/* ------------------------------------------------ media */

export async function listMedia(db: Db, category?: string): Promise<Media[]> {
  let request = db.from("media").select("*").order("created_at", { ascending: false }).limit(200);
  if (category) request = request.eq("category", category);
  const { data, error } = await request;
  raise(error);
  return (data ?? []).map(toMedia);
}

export const MEDIA_FILE_MAX_BYTES = 25 * 1024 * 1024;
const MEDIA_EXTENSIONS = [".glb", ".gltf", ".lottie"];

export async function uploadMedia(db: Db, file: File, category: Media["category"] = "misc"): Promise<Media> {
  if (file.size > MEDIA_FILE_MAX_BYTES) throw new DataError(400, "File must be 25MB or smaller");

  const lowerName = file.name.toLowerCase();
  const isKnown = file.type.startsWith("image/") || MEDIA_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  if (!isKnown) throw new DataError(400, "Only images, GLB/GLTF models, or Lottie files are accepted");

  const storagePath = `${category}/${Date.now()}-${safeFilename(file.name)}`;
  const { error: uploadError } = await db.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw new DataError(500, uploadError.message);

  const { data: publicUrl } = db.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  const payload = mediaCreateSchema.parse({
    filename: file.name,
    url: publicUrl.publicUrl,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    category,
  });

  const { data, error } = await db
    .from("media")
    .insert({
      filename: payload.filename,
      url: payload.url,
      storage_path: storagePath,
      mime_type: payload.mimeType,
      size: payload.size,
      category: payload.category,
    })
    .select()
    .single();
  if (error) {
    await db.storage.from(MEDIA_BUCKET).remove([storagePath]);
    raise(error);
  }
  return toMedia(data);
}

export async function deleteMedia(db: Db, id: string): Promise<void> {
  const { data, error } = await db.from("media").delete().eq("id", id).select("storage_path").maybeSingle();
  raise(error);
  if (!data) throw new DataError(404, "Media not found");
  if (data.storage_path) {
    await db.storage.from(MEDIA_BUCKET).remove([data.storage_path]);
  }
}

/* ------------------------------------------------ settings */

function isSettingKey(key: string): key is SettingKey {
  return (settingKeyValues as readonly string[]).includes(key);
}

/** Stored values merged over the built-in defaults, so the admin editors always have something to show. */
export async function listSettingsAdmin(db: Db): Promise<{ settings: SiteSettings }> {
  const { data, error } = await db.from("settings").select("key, value");
  raise(error);
  const byKey = new Map((data ?? []).map((row: { key: string; value: unknown }) => [row.key, row.value]));
  return {
    settings: {
      homepageContent: (byKey.get("homepage-content") ??
        defaultSettings["homepage-content"]) as SiteSettings["homepageContent"],
      contactDetails: (byKey.get("contact-details") ??
        defaultSettings["contact-details"]) as SiteSettings["contactDetails"],
      galleryFrames: (byKey.get("gallery-frames") ??
        defaultSettings["gallery-frames"]) as SiteSettings["galleryFrames"],
      seo: (byKey.get("seo") ?? defaultSettings.seo) as SiteSettings["seo"],
    },
  };
}

export async function updateSetting(db: Db, key: string, value: unknown): Promise<void> {
  if (!isSettingKey(key)) throw new DataError(404, "Setting not found");
  const parsed = settingsUpdateSchema.parse({ key, value });
  const { error } = await db.from("settings").upsert({ key, value: parsed.value }, { onConflict: "key" });
  raise(error);
}

/* ------------------------------------------------ dashboards */

export async function getDashboardSummary(db: Db): Promise<DashboardSummary> {
  const [summary, contacts, applications] = await Promise.all([
    db.rpc("dashboard_summary"),
    db.from("contacts").select("*").order("created_at", { ascending: false }).limit(5),
    db.from("applications").select(APPLICATION_SELECT).order("created_at", { ascending: false }).limit(5),
  ]);
  raise(summary.error);
  raise(contacts.error);
  raise(applications.error);

  return {
    ...(summary.data as Omit<DashboardSummary, "recentContacts" | "recentApplications">),
    recentContacts: (contacts.data ?? []).map(toContact),
    recentApplications: (applications.data ?? []).map(toApplicationWithRole),
  };
}

export async function getAnalyticsSummary(db: Db): Promise<AnalyticsSummary> {
  const { data, error } = await db.rpc("analytics_summary");
  raise(error);
  return data as AnalyticsSummary;
}
