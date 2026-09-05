import { apiRequestEnveloped, API_BASE } from "./apiClient";
import type { User } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  return apiRequestEnveloped<null>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function verifyAccount(token: string) {
  return apiRequestEnveloped<null>("/auth/verify-account", {
    method: "POST",
    body: { token },
  });
}

export async function login(email: string, password: string) {
  return apiRequestEnveloped<null>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function logout() {
  return apiRequestEnveloped<null>("/auth/logout", { method: "POST" });
}

export async function getMe() {
  const res = await apiRequestEnveloped<User>("/auth/me");
  return res.data;
}

export async function checkSession(): Promise<boolean> {
  try {
    const res = await apiRequestEnveloped<null>("/auth/check-session", {
      skipAuthRetry: true,
    });
    return res.success;
  } catch {
    return false;
  }
}

export async function forgotPasswordEmail(email: string) {
  return apiRequestEnveloped<null>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/** token/id come from the emailed reset link's query params. */
export async function resetPassword(
  token: string,
  id: string,
  password: string,
) {
  const query = new URLSearchParams({ token, id }).toString();
  return apiRequestEnveloped<null>(`/auth/reset-password?${query}`, {
    method: "PUT",
    body: { password },
  });
}

export function googleLoginUrl() {
  return `${API_BASE}/auth/google`;
}

type SocialProvider = "youtube" | "facebook" | "tiktok";

/** These are full-page redirects (OAuth consent hop), not fetch calls. */
export function socialConnectUrl(provider: SocialProvider) {
  return `${API_BASE}/auth/${provider}/connect`;
}
