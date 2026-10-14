import type { SupabaseClient } from "@supabase/supabase-js";

// The schema is hand-written SQL (supabase/migrations), so the client is intentionally untyped.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = SupabaseClient<any, any, any>;

/** Mirrors the old REST client's ApiRequestError so existing form code keeps working. */
export class DataError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "DataError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface PostgrestLikeError {
  code?: string;
  message: string;
}

/** Throws a DataError for a Supabase error, translating the common Postgres codes. */
export function raise(error: PostgrestLikeError | null, uniqueMessage = "That value already exists"): void {
  if (!error) return;
  if (error.code === "23505") throw new DataError(409, uniqueMessage);
  if (error.code === "42501" || error.code === "PGRST301") throw new DataError(401, "Authentication required");
  if (error.code === "PGRST116") throw new DataError(404, "Not found");
  if (error.code === "23503") throw new DataError(404, "A related record no longer exists");
  throw new DataError(500, error.message);
}

export interface Page {
  page: number;
  pageSize: number;
}

export function pageRange({ page, pageSize }: Page): [number, number] {
  return [(page - 1) * pageSize, page * pageSize - 1];
}

export function paginate<T>(items: T[], total: number, { page, pageSize }: Page) {
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/** Strips characters that have meaning inside a PostgREST `or()` filter or an ilike pattern. */
export function cleanSearch(term: string): string {
  return term.replace(/[,()%*\\_:"']/g, " ").trim();
}

export function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export const MEDIA_BUCKET = "media";
export const APPLICATIONS_BUCKET = "applications";
