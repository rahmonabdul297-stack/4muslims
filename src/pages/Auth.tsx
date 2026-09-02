import { useState, type ReactNode } from "react";
import {
  Sparkles,
  Clapperboard,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button, Input, Field } from "@/components/ui";
import { TemplateThumbnail } from "@/components/TemplateThumb";
import { templates, surahs } from "@/data";
import { useApp } from "@/store";
import { useToast } from "@/toast";

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left showcase */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 bg-ink-card border-r border-ink-overlay/[0.06]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(16,185,129,0.15), transparent 50%), radial-gradient(circle at 70% 60%, rgba(15,118,110,0.12), transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-gold flex items-center justify-center">
                <Clapperboard className="w-3 h-3 text-white" />
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-text">4Muslims</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                AI Verse Studio
              </p>
            </div>
          </div>

          <div className="relative w-48 mx-auto mb-8">
            <TemplateThumbnail
              template={templates[0]}
              surahArabic={surahs[0].arabic}
              className="aspect-[9/16] shadow-glow"
            />
            <div className="absolute -inset-4 bg-emerald-mint/10 blur-2xl -z-10 rounded-full" />
          </div>

          <h2 className="text-2xl font-bold text-ink-text text-center mb-2">
            Create Beautiful Quran Videos
          </h2>
          <p className="text-sm text-slate-400 text-center leading-relaxed">
            AI-powered verse video generator with auto-posting to your social
            platforms. Spread da'wah, one frame at a time.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" /> 114
              Surahs
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" /> 5
              Reciters
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-mint" />{" "}
              Auto-Post
            </span>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-ink-text">4Muslims</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white text-slate-800 text-sm font-medium hover:bg-slate-100 transition active:scale-[0.98]">
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}

export function LoginPage() {
  const { navigate } = useApp();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email.includes("@")) errs.email = "Enter a valid email address";
    if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      push("Welcome back!", "success");
      navigate("dashboard");
    }, 1200);
  };

  return (
    <AuthShell>
      <h2 className="text-2xl font-bold text-ink-text mb-1">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-6">
        Sign in to continue creating verse videos
      </p>

      <div className="space-y-4">
        <GoogleButton label="Sign in with Google" />

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-ink-overlay/10" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-ink-overlay/10" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                error={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                error={!!errors.password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-ink-overlay/20 bg-transparent accent-emerald-mint"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-emerald-mint hover:text-emerald-400"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("register")}
            className="text-emerald-mint hover:text-emerald-400 font-medium"
          >
            Create one
          </button>
        </p>
      </div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { navigate } = useApp();
  const { push } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "Enter your full name";
    if (!email.includes("@")) errs.email = "Enter a valid email address";
    if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      push(
        "Account created! Check your email for the verification code.",
        "success",
      );
      navigate("verify");
    }, 1400);
  };

  return (
    <AuthShell>
      <h2 className="text-2xl font-bold text-ink-text mb-1">
        Create your account
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Start generating beautiful Quran verse videos
      </p>

      <div className="space-y-4">
        <GoogleButton label="Sign up with Google" />

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-ink-overlay/10" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-ink-overlay/10" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Full Name" error={errors.name}>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Adebayo Ibrahim"
                value={name}
                error={!!errors.name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Email" error={errors.email}>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                error={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field
            label="Password"
            error={errors.password}
            hint="Minimum 6 characters"
          >
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                error={!!errors.password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("login")}
            className="text-emerald-mint hover:text-emerald-400 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}

export function VerifyPage() {
  const { navigate } = useApp();
  const { push } = useToast();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const setDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) {
      (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length !== 6) {
      push("Enter the 6-digit verification code", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      push("Email verified successfully!", "success");
      navigate("dashboard");
    }, 1400);
  };

  return (
    <AuthShell>
      <h2 className="text-2xl font-bold text-ink-text mb-1">
        Verify your email
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        We sent a 6-digit code to your email. Enter it below to activate your
        account.
      </p>

      <form onSubmit={submit} className="space-y-6">
        <div className="flex gap-2 justify-between">
          {code.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-ink-page/60 border border-ink-overlay/[0.08] text-ink-text focus:outline-none focus:ring-2 focus:ring-emerald-mint/30 focus:border-emerald-mint/40 transition"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Verify Account
          <CheckCircle2 className="w-4 h-4" />
        </Button>

        <div className="text-center text-sm text-slate-500">
          Didn't receive a code?{" "}
          <button
            type="button"
            onClick={() => push("Code resent to your email", "info")}
            className="text-emerald-mint hover:text-emerald-400 font-medium"
          >
            Resend code
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("login")}
          className="block mx-auto text-xs text-slate-500 hover:text-slate-300"
        >
          Back to sign in
        </button>
      </form>
    </AuthShell>
  );
}
