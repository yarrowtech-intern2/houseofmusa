import type { AdminRole } from "@houseofmusa/types";
import { getServerDb } from "./supabase/server";

export interface AdminSession {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

/** The signed-in user if they also have an admin_profiles row; otherwise null. */
export async function getServerSession(): Promise<AdminSession | null> {
  const db = getServerDb();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data: profile } = await db.from("admin_profiles").select("name, role").eq("id", user.id).maybeSingle();
  if (!profile) return null;

  return { sub: user.id, email: user.email ?? "", name: profile.name, role: profile.role };
}
