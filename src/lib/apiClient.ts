const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9999/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: T;
  count?: number;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
  /** Skip the 401 -> refresh -> retry dance (used by the refresh call itself). */
  skipAuthRetry?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = rawRequest("/auth/refresh", {
      method: "POST",
      skipAuthRetry: true,
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function rawRequest(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { method = "GET", body, isFormData } = options;
  const headers: Record<string, string> = {};
  if (!isFormData && body !== undefined)
    headers["Content-Type"] = "application/json";

  return fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });
}

/** Sends a request and auto-retries once after a 401 refresh. */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let res = await rawRequest(path, options);

  if (res.status === 401 && !options.skipAuthRetry) {
    const refreshed = await doRefresh();
    if (refreshed) {
      res = await rawRequest(path, options);
    }
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      (json as Envelope<T> | null)?.message || `Request failed: ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return json as T;
}

/** For endpoints that return data directly, enveloped in `{ data }`, or `{ user }`. */
export async function apiRequestEnveloped<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await apiRequest<Envelope<T> | T>(path, options);

  if (res && typeof res === "object") {
    // 1. If wrapped inside `data` property
    if ("data" in res && res.data !== undefined && res.data !== null) {
      return res.data as T;
    }

    // 2. If wrapped inside `user` property
    if ("user" in res && res.user !== undefined && res.user !== null) {
      return res.user as T;
    }
  }

  // 3. Fallback: return the payload directly if not enveloped
  if (res !== undefined && res !== null) {
    return res as T;
  }

  throw new ApiError("No valid data returned in response", 500);
}

export { API_BASE };