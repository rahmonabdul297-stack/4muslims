import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Clapperboard,
} from "lucide-react";
import { Button, GlassCard } from "@/components/ui";
import { verifyPayment } from "@/lib/paymentsApi";
import { useApp } from "@/store";

export function PaymentVerifyPage() {
  const { paymentReference, navigate, refreshUser } = useApp();
  const [status, setStatus] = useState<"checking" | "success" | "failed">(
    "checking",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!paymentReference) {
      setStatus("failed");
      setMessage("No payment reference was found.");
      return;
    }
    let cancelled = false;
    verifyPayment(paymentReference)
      .then((res) => {
        if (cancelled) return;
        setStatus("success");
        setMessage(res.message || "Payment verified successfully.");
        refreshUser();
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("failed");
        setMessage(
          err instanceof Error ? err.message : "Unable to verify this payment.",
        );
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentReference]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <GlassCard className="p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-gold flex items-center justify-center">
              <Clapperboard className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
          <span className="text-base font-bold text-ink-text">4Muslims</span>
        </div>

        {status === "checking" && (
          <>
            <Loader2 className="w-10 h-10 text-emerald-mint animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-ink-text mb-1">
              Verifying your payment...
            </h2>
            <p className="text-sm text-slate-500">
              This will only take a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-mint mx-auto mb-4" />
            <h2 className="text-lg font-bold text-ink-text mb-1">
              Payment successful
            </h2>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <Button className="w-full" onClick={() => navigate("/billing")}>
              Go to Billing
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-ink-text mb-1">
              Payment verification failed
            </h2>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/billing")}
            >
              Back to Billing
            </Button>
          </>
        )}
      </GlassCard>
    </div>
  );
}
