import { apiRequest, apiRequestEnveloped } from "./apiClient";
import type {
  AutoPostSettingsData,
  GenerateVideoPayload,
  GenerateVideoResult,
  GeneratedVideo,
  VideoStatusResponse,
} from "@/types";

export async function generateVideo(payload: GenerateVideoPayload) {
  const res = await apiRequestEnveloped<GenerateVideoResult>("/videos/custom", {
    method: "POST",
    body: payload,
  });
  return res.data as GenerateVideoResult;
}

/** Raw (non-enveloped) response — poll this while status is pending/processing. */
export async function getVideoStatus(jobId: string) {
  return apiRequest<VideoStatusResponse>(`/videos/status/${jobId}`);
}

export async function getVideoHistory() {
  const res = await apiRequestEnveloped<GeneratedVideo[]>("/videos/history");
  return res.data ?? [];
}

export interface AutoPostSettingsPayload {
  enabled: boolean;
  selectedPlatform: "youtube" | "tiktok" | "facebook";
  defaultReciterId?: string;
}

/** Raw (non-enveloped) response shape per spec, despite having a success/message/data wrapper. */
export async function updateAutoPostSettings(payload: AutoPostSettingsPayload) {
  return apiRequest<{
    success: boolean;
    message: string;
    data: AutoPostSettingsData;
  }>("/videos/autopostsettings", { method: "PUT", body: payload });
}

export async function triggerAutoPost() {
  return apiRequestEnveloped<null>("/videos/triggerautopost", {
    method: "POST",
  });
}
