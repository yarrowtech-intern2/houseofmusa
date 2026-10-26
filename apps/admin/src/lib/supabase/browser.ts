import { createBrowserClient } from "@supabase/ssr";
import type { Db } from "@hausofmusa/data";
import { supabaseAnonKey, supabaseUrl } from "./env";

let client: Db | null = null;

/** Browser client carrying the signed-in admin's session (stored in cookies by @supabase/ssr). */
export function getBrowserDb(): Db {
  client ??= createBrowserClient(supabaseUrl, supabaseAnonKey) as Db;
  return client;
}
