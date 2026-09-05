import { apiRequestEnveloped } from "./apiClient";
import type { User } from "@/types";

export async function getProfile() {
  const res = await apiRequestEnveloped<unknown>("/profile/me");
  console.log(res)
  return res.data;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  image?: File;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const form = new FormData();
  if (payload.name) form.append("name", payload.name);
  if (payload.email) form.append("email", payload.email);
  if (payload.password) form.append("password", payload.password);
  if (payload.image) form.append("image", payload.image);

  const res = await apiRequestEnveloped<User>("/profile/update-profile", {
    method: "PUT",
    body: form,
    isFormData: true,
  });
  return res.data;
}
