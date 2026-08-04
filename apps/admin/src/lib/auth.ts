import { cookies } from "next/headers";
import { apiFetch, ApiRequestError } from "./api";
import type { AdminRole } from "@houseofmusa/types";

export interface AdminSession {
  sub: string;
  email: string;
  role: AdminRole;
}

export async function getServerSession(): Promise<AdminSession | null> {
  const cookieHeader = cookies().toString();
  try {
    const data = await apiFetch<{ admin: AdminSession }>("/api/auth/me", { cookie: cookieHeader });
    return data.admin;
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) return null;
    throw err;
  }
}
