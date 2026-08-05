const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ?? "";

export const HAS_CONFIGURED_API_URL = Boolean(configuredApiUrl);
export const CAN_USE_API = HAS_CONFIGURED_API_URL || process.env.NODE_ENV !== "production";
export const API_URL = configuredApiUrl || "http://localhost:4000";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  if (!CAN_USE_API) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}
