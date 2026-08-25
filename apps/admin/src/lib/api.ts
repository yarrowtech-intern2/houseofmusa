export const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") || "http://localhost:4000";

export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { cookie?: string } = {},
): Promise<T> {
  const { cookie, ...init } = options;
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiRequestError(503, `Unable to reach the API server at ${API_URL}.`);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(res.status, body.message ?? "Request failed", body.fieldErrors);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
