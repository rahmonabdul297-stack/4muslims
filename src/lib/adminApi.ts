import { apiRequestEnveloped } from "./apiClient";
import type { GeneratedVideo } from "@/types";

/**
 * NOTE: per the backend spec, /api/v1/admin/** currently has no auth/role checks server-side.
 * The "admin-videos" route/nav item in this app is gated client-side on `user.role === 'admin'`
 * as a stop-gap — it is not a substitute for real server-side authorization.
 */
export async function getAdminVideos() {
  const res = await apiRequestEnveloped<GeneratedVideo[]>("/admin/videos");
  return res.data ?? [];
}
