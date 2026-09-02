import { Moon, Sun, Globe, Check } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { useTheme } from "@/theme";
import { useLanguage } from "@/language";
import { languages } from "@/translations";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-ink-text mb-1">
          {t("settings.appearance")}
        </h3>
        <p className="text-xs text-ink-subtle mb-5">
          {t("settings.appearanceHint")}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              id: "dark" as const,
              icon: Moon,
              label: t("settings.dark"),
              desc: t("settings.darkDesc"),
            },
            {
              id: "light" as const,
              icon: Sun,
              label: t("settings.light"),
              desc: t("settings.lightDesc"),
            },
          ].map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`relative text-left rounded-xl p-5 border-2 transition-all ${
                  active
                    ? "border-emerald-mint bg-emerald-mint/5 shadow-glow"
                    : "border-ink-overlay/[0.06] bg-ink-overlay/[0.02] hover:border-ink-overlay/15"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    active
                      ? "bg-emerald-mint/15 text-emerald-mint"
                      : "bg-ink-overlay/[0.06] text-ink-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-ink-text mb-1">
                  {opt.label}
                </p>
                <p className="text-xs text-ink-subtle">{opt.desc}</p>
                {active && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-mint flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-emerald-mint" />
          <h3 className="text-sm font-semibold text-ink-text">
            {t("settings.language")}
          </h3>
        </div>
        <p className="text-xs text-ink-subtle mb-5">
          {t("settings.languageHint")}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {languages.map((l) => {
            const active = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`relative flex items-center justify-between rounded-xl px-4 py-3 border-2 transition-all ${
                  active
                    ? "border-emerald-mint bg-emerald-mint/5 shadow-glow"
                    : "border-ink-overlay/[0.06] bg-ink-overlay/[0.02] hover:border-ink-overlay/15"
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink-text">
                    {l.nativeLabel}
                  </p>
                  <p className="text-[11px] text-ink-subtle">{l.label}</p>
                </div>
                {active && (
                  <span className="w-5 h-5 rounded-full bg-emerald-mint flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
