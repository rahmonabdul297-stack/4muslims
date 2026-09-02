import { apiRequestEnveloped } from "./apiClient";
import type { CheckoutResult, Plan } from "@/types";

export async function checkout(
  tier: Extract<Plan, "PRO" | "ULTIMATE">,
  duration: 1 | 3 | 6 | 12 = 1,
) {
  const res = await apiRequestEnveloped<CheckoutResult>("/payments/checkout", {
    method: "POST",
    body: { tier, duration, currency: "NGN" },
  });
  return res.data as CheckoutResult;
}

/** Public endpoint — no auth required. Call on the /payment/verify page after Paystack redirects back. */
export async function verifyPayment(reference: string) {
  const res = await apiRequestEnveloped<Record<string, unknown>>(
    `/payments/verify/${reference}`,
    {
      skipAuthRetry: true,
    },
  );
  return res;
}
