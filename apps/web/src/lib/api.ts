import { createClient } from "@supabase/supabase-js";
import type { Db } from "@hausofmusa/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** False until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set; the site then serves its static content. */
export const CAN_USE_API = Boolean(supabaseUrl && supabaseAnonKey);

let client: Db | null = null;

/** Anonymous Supabase client — RLS limits it to published content and the public submission forms. */
export function getDb(): Db {
  if (!CAN_USE_API) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not configured.");
  }
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
