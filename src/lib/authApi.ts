import { apiRequest, apiRequestEnveloped, API_BASE } from "./apiClient";
import type { User } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
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
  return res.data as User;
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

export async function forgotPasswordSms(phone: string) {
  return apiRequestEnveloped<null>("/auth/SMS/forgot-password", {
    method: "POST",
    body: { phone },
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequestEnveloped<null>("/auth/reset-password", {
    method: "PUT",
    body: { token, newPassword },
  });
}

export async function resetPasswordOtp(otp: string, newPassword: string) {
  return apiRequestEnveloped<null>("/auth/OTP/reset-password", {
    method: "PUT",
    body: { otp, newPassword },
  });
}

export function googleLoginUrl() {
  return `${API_BASE}/auth/google`;
}

type SocialProvider = "youtube" | "facebook" | "tiktok";

export async function getSocialConnectUrl(provider: SocialProvider) {
  const res = await apiRequest<{ success: boolean; url: string }>(
    `/auth/${provider}/connect`,
  );
  return res.url;
}
