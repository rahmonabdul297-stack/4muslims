import {
  Sparkles,
  Clapperboard,
  ArrowRight,
  BookOpen,
  Clock,
  HandHeart,
  Heart,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  Mic,
  Zap,
} from "lucide-react";
import { useApp } from "@/store";
import { useTheme } from "@/theme";
import { useLanguage } from "@/language";
import { languages } from "@/translations";
import { Button, GlassCard, Badge } from "@/components/ui";
import { TemplateThumbnail } from "@/components/TemplateThumb";
import { templates, surahs, pricingPlans } from "@/data";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center shadow-glow">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-gold flex items-center justify-center">
          <Clapperboard className="w-2.5 h-2.5 text-white" />
        </span>
      </div>
      <span className="text-lg font-bold text-ink-text tracking-tight">
        4Muslims
      </span>
    </div>
  );
}

function QuickSettings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-lg glass flex items-center justify-center text-ink-text hover:border-emerald-mint/30 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>
      <div className="relative">
        <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="glass rounded-lg pl-8 pr-3 py-2 text-xs font-medium text-ink-text focus:outline-none focus:ring-2 focus:ring-emerald-mint/20 appearance-none cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { navigate } = useApp();
  const { t } = useLanguage();

  const freeFeatures = [
    {
      icon: BookOpen,
      title: t("landing.free.quran"),
      desc: t("landing.free.quranDesc"),
    },
    {
      icon: Clock,
      title: t("landing.free.prayer"),
      desc: t("landing.free.prayerDesc"),
    },
    {
      icon: HandHeart,
      title: t("landing.free.duas"),
      desc: t("landing.free.duasDesc"),
    },
    {
      icon: Heart,
      title: t("landing.free.favorites"),
      desc: t("landing.free.favoritesDesc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass-strong border-b border-ink-overlay/[0.06]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            <QuickSettings />
            <Button variant="ghost" size="sm" onClick={() => navigate("login")}>
              {t("landing.ctaSecondary")}
            </Button>
            <Button size="sm" onClick={() => navigate("register")}>
              {t("landing.ctaPrimary")}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.12), transparent 45%), radial-gradient(circle at 85% 20%, rgba(217,119,6,0.08), transparent 45%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge tone="emerald" className="mb-5">
              <Sparkles className="w-3 h-3" />
              {t("landing.badge")}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink-text tracking-tight leading-tight mb-3">
              {t("landing.title")}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-mint to-emerald-deep bg-clip-text text-transparent leading-tight mb-5">
              {t("landing.titleHighlight")}
            </h2>
            <p className="text-base text-ink-muted leading-relaxed mb-8 max-w-xl">
              {t("landing.subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Button size="lg" onClick={() => navigate("register")}>
                {t("landing.ctaPrimary")}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("login")}
              >
                {t("landing.ctaSecondary")}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-mint" />{" "}
                {t("landing.statSurahs")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-mint" />{" "}
                {t("landing.statReciters")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-mint" />{" "}
                {t("landing.statFree")}
              </span>
            </div>
          </div>

          <div className="relative flex justify-center animate-fade-in">
            <div className="relative w-56 sm:w-64">
              <TemplateThumbnail
                template={templates[0]}
                surahArabic={surahs[0].arabic}
                className="aspect-[9/16] shadow-glow"
              />
              <div className="absolute -inset-6 bg-emerald-mint/10 blur-3xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Free features */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge tone="emerald" className="mb-4">
            {t("landing.statFree")}
          </Badge>
          <h2 className="text-3xl font-bold text-ink-text tracking-tight mb-3">
            {t("landing.free.title")}
          </h2>
          <p className="text-ink-muted">{t("landing.free.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {freeFeatures.map((f) => (
            <GlassCard key={f.title} hover className="p-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-mint/15 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-emerald-mint" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-ink-text">
                  {f.title}
                </h3>
                <Badge tone="emerald" className="text-[9px] px-1.5 py-0">
                  {t("nav.free")}
                </Badge>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Studio highlight */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <GlassCard className="p-8 lg:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6 text-gold-light" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-text tracking-tight mb-2">
              {t("landing.studio.title")}
            </h2>
            <p className="text-sm text-emerald-400 font-medium mb-4">
              {t("landing.studio.subtitle")}
            </p>
            <p className="text-ink-muted leading-relaxed mb-6">
              {t("landing.studio.desc")}
            </p>
            <ul className="space-y-3 mb-8">
              {[
                t("landing.studio.f1"),
                t("landing.studio.f2"),
                t("landing.studio.f3"),
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-ink-faint"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-mint mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("register")}>
              {t("landing.pricing.cta")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {templates.slice(0, 4).map((tpl) => (
              <TemplateThumbnail
                key={tpl.id}
                template={tpl}
                surahArabic={surahs[1].arabic}
                className="aspect-[9/16] rounded-xl"
              />
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-ink-text tracking-tight mb-3">
            {t("landing.pricing.title")}
          </h2>
          <p className="text-ink-muted">{t("landing.pricing.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {pricingPlans.map((p) => (
            <GlassCard
              key={p.id}
              className={`p-6 ${p.highlight ? "border-emerald-mint/30 shadow-glow" : ""}`}
            >
              <h3 className="text-base font-bold text-ink-text mb-1">
                {p.name}
              </h3>
              <p className="text-xs text-ink-subtle mb-4">{p.tagline}</p>
              <p className="text-2xl font-bold text-ink-text mb-4">
                {p.id === "FREE" ? "₦0" : `₦${p.priceNGN.toLocaleString()}`}
                <span className="text-xs text-ink-subtle font-normal">/mo</span>
              </p>
              <Button
                variant={p.highlight ? "primary" : "secondary"}
                className="w-full"
                onClick={() => navigate("register")}
              >
                {t("landing.ctaPrimary")}
              </Button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-overlay/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-ink-subtle text-center flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" /> {t("landing.footer.tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}
