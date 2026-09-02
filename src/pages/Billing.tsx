import { useState } from "react";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { GlassCard, Badge, Button } from "@/components/ui";
import { pricingPlans, durationOptions, planTierLimits } from "@/data";
import { useApp } from "@/store";
import { useToast } from "@/toast";
import { ApiError } from "@/lib/apiClient";
import { checkout } from "@/lib/paymentsApi";
import type { Plan } from "@/types";

const planIcons: Record<Plan, typeof Sparkles> = {
  FREE: Sparkles,
  PRO: Zap,
  ULTIMATE: Crown,
};

export function BillingPage() {
  const { user } = useApp();
  const { push } = useToast();
  const [duration, setDuration] = useState<1 | 3 | 6 | 12>(1);
  const [checkingOut, setCheckingOut] = useState<Plan | null>(null);

  const plan = user?.plan ?? "FREE";
  const limits = planTierLimits[plan];
  const rendersUsed = user?.monthlyUsage?.manualGenerationsCount ?? 0;
  const autoPostsUsed = user?.autoPostSettings?.monthlyAutoPostCount ?? 0;

  const discount =
    duration === 12 ? 0.2 : duration === 6 ? 0.15 : duration === 3 ? 0.1 : 0;

  const startCheckout = async (tier: Extract<Plan, "PRO" | "ULTIMATE">) => {
    setCheckingOut(tier);
    try {
      const result = await checkout(tier, duration);
      window.location.href = result.checkoutUrl;
    } catch (err) {
      push(
        err instanceof ApiError
          ? err.message
          : "Unable to start checkout. Please try again.",
        "error",
      );
      setCheckingOut(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Usage Overview */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-mint" />
          <h3 className="text-sm font-semibold text-ink-text">Current Usage</h3>
          <Badge
            tone={
              plan === "FREE" ? "neutral" : plan === "PRO" ? "emerald" : "gold"
            }
          >
            {plan} Plan
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <UsageMeter
            label="Monthly Renders"
            used={rendersUsed}
            total={limits.manualRendersPerMonth}
          />
          <UsageMeter
            label="Auto-Posts"
            used={autoPostsUsed}
            total={limits.autoPostsPerMonth}
          />
        </div>
      </GlassCard>

      {/* Duration Selector */}
      <div className="flex items-center justify-center">
        <div className="flex gap-1.5 glass rounded-xl p-1">
          {durationOptions.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d as 1 | 3 | 6 | 12)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
                duration === d
                  ? "bg-emerald-mint/15 text-emerald-400"
                  : "text-slate-400 hover:text-ink-text"
              }`}
            >
              {d} {d === 1 ? "month" : "months"}
              {d >= 3 && (
                <span className="absolute -top-2 -right-1 text-[8px] font-bold px-1 py-0.5 rounded bg-gold/20 text-gold-light border border-gold/30">
                  -{discount * 100}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {pricingPlans.map((p) => {
          const Icon = planIcons[p.id];
          const isCurrent = plan === p.id;
          const monthly = p.priceNGN;
          const total = Math.round(monthly * duration * (1 - discount));
          const displayPrice = p.id === "FREE" ? 0 : total;

          return (
            <GlassCard
              key={p.id}
              className={`p-6 relative flex flex-col ${
                p.highlight ? "border-emerald-mint/30 shadow-glow" : ""
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge tone="emerald">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    p.id === "FREE"
                      ? "bg-ink-overlay/[0.06]"
                      : p.id === "PRO"
                        ? "bg-emerald-mint/15"
                        : "bg-gold/15"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${p.id === "FREE" ? "text-slate-300" : p.id === "PRO" ? "text-emerald-mint" : "text-gold-light"}`}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-text">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{p.tagline}</p>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-ink-text">
                    ₦{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    /{duration === 1 ? "mo" : `${duration}mo`}
                  </span>
                </div>
                {p.id !== "FREE" && duration > 1 && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ₦{monthly.toLocaleString()}/mo · save ₦
                    {Math.round(monthly * duration * discount).toLocaleString()}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <Check
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.id === "FREE" ? "text-slate-500" : "text-emerald-mint"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button variant="secondary" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : p.id === "FREE" ? (
                <Button variant="secondary" className="w-full" disabled>
                  Free Plan
                </Button>
              ) : (
                <Button
                  variant={p.id === "ULTIMATE" ? "gold" : "primary"}
                  className="w-full"
                  loading={checkingOut === p.id}
                  disabled={checkingOut !== null}
                  onClick={() => startCheckout(p.id as "PRO" | "ULTIMATE")}
                >
                  <CreditCard className="w-4 h-4" />
                  {p.id === "ULTIMATE"
                    ? "Get Ultimate"
                    : "Upgrade with Paystack"}
                </Button>
              )}
            </GlassCard>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500">
        Secure checkout powered by Paystack · Prices in Nigerian Naira (₦)
      </p>
    </div>
  );
}

function UsageMeter({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const unlimited = total === -1;
  const pct = unlimited
    ? 0
    : total > 0
      ? Math.min((used / total) * 100, 100)
      : 0;
  const displayTotal = unlimited ? "∞" : `${total}`;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-medium text-ink-text">
          {used} / {displayTotal}
        </span>
      </div>
      <div className="h-2 rounded-full bg-ink-overlay/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct > 80
              ? "bg-amber-500"
              : "bg-gradient-to-r from-emerald-deep to-emerald-mint"
          }`}
          style={{ width: unlimited ? "100%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}
