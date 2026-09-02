import { type ButtonHTMLAttributes, type ReactNode, useEffect } from "react";
import { Loader2, X } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-mint/40 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-mint text-white hover:bg-emerald-mint/90 shadow-glow hover:shadow-glow active:scale-[0.98]",
  secondary:
    "bg-ink-overlay/[0.04] text-slate-200 border border-ink-overlay/[0.08] hover:bg-ink-overlay/[0.08] hover:border-emerald-mint/30 active:scale-[0.98]",
  ghost:
    "text-slate-300 hover:text-ink-text hover:bg-ink-overlay/[0.05] active:scale-[0.98]",
  gold: "bg-gold text-white hover:bg-gold-light shadow-glow-gold active:scale-[0.98]",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "emerald" | "gold" | "red" | "amber";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-overlay/[0.06] text-slate-300 border-ink-overlay/[0.08]",
    emerald: "bg-emerald-mint/15 text-emerald-400 border-emerald-mint/25",
    gold: "bg-gold/15 text-gold-light border-gold/30",
    red: "bg-red-500/15 text-red-400 border-red-500/25",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PlanPill({ plan }: { plan: "FREE" | "PRO" | "ULTIMATE" }) {
  const map = {
    FREE: "bg-ink-overlay/[0.06] text-slate-300 border-ink-overlay/[0.1]",
    PRO: "bg-emerald-mint/15 text-emerald-400 border-emerald-mint/30 shadow-glow",
    ULTIMATE: "bg-gold/15 text-gold-light border-gold/30 shadow-glow-gold",
  };
  return (
    <span
      className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md border ${map[plan]}`}
    >
      {plan}
    </span>
  );
}

export function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl ${hover ? "transition-all duration-300 hover:border-emerald-mint/30 hover:bg-ink-overlay/[0.05]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const dims =
    size === "sm"
      ? { w: "w-9", h: "h-5", k: "w-3.5 h-3.5", t: "translate-x-4" }
      : { w: "w-12", h: "h-7", k: "w-5 h-5", t: "translate-x-5" };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative ${dims.w} ${dims.h} rounded-full transition-colors duration-300 ${
        checked
          ? "bg-emerald-mint shadow-glow"
          : "bg-ink-overlay/[0.1] border border-ink-overlay/[0.08]"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 left-1 ${dims.k} rounded-full bg-white transition-transform duration-300 ${
          checked ? dims.t : ""
        }`}
      />
    </button>
  );
}

export function Modal({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-page/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative glass-strong rounded-2xl w-full max-w-lg ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-ink-text p-1 rounded-lg hover:bg-ink-overlay/[0.06] transition"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ProgressRing({
  progress,
  size = 120,
}: {
  progress: number;
  size?: number;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-ink-text">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`w-4 h-4 animate-spin ${className}`} />;
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300 mb-1.5 block">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-red-400 mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500 mt-1 block">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({
  error,
  className = "",
  ...props
}: { error?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-ink-page/60 border rounded-xl px-4 py-2.5 text-sm text-ink-text placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
        error
          ? "border-red-500/40 focus:ring-red-500/20"
          : "border-ink-overlay/[0.08] focus:border-emerald-mint/40 focus:ring-emerald-mint/20"
      } ${className}`}
      {...props}
    />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full bg-ink-page/60 border border-ink-overlay/[0.08] rounded-xl px-4 py-2.5 text-sm text-ink-text focus:outline-none focus:ring-2 focus:ring-emerald-mint/20 focus:border-emerald-mint/40 transition appearance-none cursor-pointer ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "36px",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-text mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
    </div>
  );
}
