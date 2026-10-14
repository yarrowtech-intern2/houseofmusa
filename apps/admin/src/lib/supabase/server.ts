import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Db } from "@houseofmusa/data";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Server-component / route-handler client bound to the request's session cookies. */
export function getServerDb(): Db {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only; middleware refreshes the session instead.
        }
      },
    },
  }) as Db;
}
