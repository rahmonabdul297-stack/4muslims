import { useState, type ReactNode } from "react";
import {
  Clapperboard,
  History,
  Instagram,
  Zap,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Clock,
  HandHeart,
  Heart,
  Settings,
  UserCircle,
  ShieldAlert,
} from "lucide-react";
import { useApp, type Route } from "@/store";
import { useLanguage } from "@/language";
import { PlanPill, Button, Badge } from "./ui";
import { planTierLimits } from "@/data";

const navItems: {
  route: Route;
  labelKey: string;
  icon: typeof Clapperboard;
  pro?: boolean;
  free?: boolean;
  admin?: boolean;
}[] = [
  { route: "create", labelKey: "nav.studio", icon: Clapperboard },
  { route: "history", labelKey: "nav.library", icon: History },
  { route: "autopost", labelKey: "nav.autopost", icon: Zap, pro: true },
  { route: "integrations", labelKey: "nav.integrations", icon: Instagram },
  { route: "quran", labelKey: "nav.quran", icon: BookOpen, free: true },
  {
    route: "prayer-times",
    labelKey: "nav.prayerTimes",
    icon: Clock,
    free: true,
  },
  { route: "duas", labelKey: "nav.duas", icon: HandHeart, free: true },
  {
    route: "quran-favorites",
    labelKey: "nav.favorites",
    icon: Heart,
    free: true,
  },
  { route: "billing", labelKey: "nav.billing", icon: CreditCard },
  { route: "profile", labelKey: "nav.profile", icon: UserCircle },
  { route: "settings", labelKey: "nav.settings", icon: Settings },
  {
    route: "admin-videos",
    labelKey: "nav.adminVideos",
    icon: ShieldAlert,
    admin: true,
  },
];

export function Sidebar() {
  const { route, navigate, user, logout } = useApp();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = () => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
      {navItems
        .filter((item) => !item.admin || user?.role === "admin")
        .map((item) => {
          const Icon = item.icon;
          const routeGroup: Route[] =
            item.route === "quran"
              ? ["quran", "quran-surah", "quran-juz"]
              : [item.route];
          const isActive = routeGroup.includes(route);
          return (
            <button
              key={item.route}
              onClick={() => {
                navigate(item.route);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-mint/10 text-emerald-400 border border-emerald-mint/20"
                  : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.04] border border-transparent"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] ${isActive ? "text-emerald-mint" : ""}`}
              />
              <span className="flex-1 text-left">{t(item.labelKey)}</span>
              {item.pro && (
                <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold/15 text-gold-light border border-gold/30">
                  PRO
                </span>
              )}
              {item.free && (
                <Badge tone="emerald" className="text-[9px] px-1.5 py-0">
                  {t("nav.free")}
                </Badge>
              )}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-mint shadow-glow" />
              )}
            </button>
          );
        })}
    </nav>
  );

  const Profile = () => (
    <div className="p-3 border-t border-ink-overlay/[0.06]">
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center text-xs font-bold text-white shrink-0">
          {(user?.name ?? "?").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-text truncate">
            {user?.name ?? "Guest"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <PlanPill plan={user?.plan ?? "FREE"} />
            <span className="text-[11px] text-slate-500 truncate">
              {user?.email ?? ""}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  const Logo = () => (
    <div className="flex flex-col items-start">
      <img src="/images/4muslims_logo.png" className="h-12 w-[150px]" />
      <i className="text-[8px] px-3 text-[#767373]">Qur'an Studio.</i>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 glass-strong border-r border-ink-overlay/[0.06]">
        <Logo />
        <NavList />
        <Profile />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg glass flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-ink-text" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div
            className="absolute inset-0 bg-ink-page/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 h-full glass-strong border-r border-ink-overlay/[0.06] flex flex-col animate-fade-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-ink-text"
            >
              <X className="w-5 h-5" />
            </button>
            <Logo />
            <NavList />
            <Profile />
          </aside>
        </div>
      )}
    </>
  );
}

const titles: Record<string, { title: string; subtitle: string }> = {
  create: { title: "Video Studio", subtitle: "Generate AI Quran verse videos" },
  history: { title: "Library", subtitle: "Your render history & downloads" },
  autopost: { title: "Auto-Post", subtitle: "Automate daily da'wah content" },
  integrations: {
    title: "Integrations",
    subtitle: "Connect your social platforms",
  },
  billing: { title: "Billing & Pricing", subtitle: "Manage your subscription" },
  quran: {
    title: "Quran Reader",
    subtitle: "Read and listen to all 114 surahs — free for everyone",
  },
  "quran-surah": {
    title: "Surah",
    subtitle: "Read, listen, and save your favorite ayahs",
  },
  "quran-juz": { title: "Juz", subtitle: "Read the Quran by juz" },
  "prayer-times": {
    title: "Prayer Times",
    subtitle: "Daily prayer times and next-prayer countdown",
  },
  duas: {
    title: "Duas & Dhikr",
    subtitle: "Browse daily supplications and after-salah dhikr",
  },
  "quran-favorites": { title: "Favorites", subtitle: "Your saved ayahs" },
  settings: {
    title: "Settings",
    subtitle: "Personalize your appearance and language",
  },
  profile: { title: "Profile", subtitle: "Manage your account details" },
  "admin-videos": {
    title: "Admin Videos",
    subtitle: "Every user's rendered video, across the whole platform",
  },
};

export function TopBar() {
  const { route, navigate, user } = useApp();
  const pageMeta = titles[route] ?? titles.create;
  const plan = user?.plan ?? "FREE";
  const limits = planTierLimits[plan];
  const limit = limits.manualRendersPerMonth;
  const used = user?.monthlyUsage?.manualGenerationsCount ?? 0;

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-ink-overlay/[0.06] px-5 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4 pl-12 lg:pl-0">
        <div className="min-w-0">
          <h2 className="text-lg lg:text-xl font-bold text-ink-text tracking-tight truncate">
            {pageMeta.title}
          </h2>
          <p className="text-xs lg:text-sm text-slate-500 truncate">
            {pageMeta.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {plan === "FREE" && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-mint" />
              <span className="font-medium text-ink-text">
                {used}/{limit}
              </span>
              <span className="text-slate-500">Renders</span>
            </div>
          )}
          {plan !== "ULTIMATE" && (
            <Button
              size="sm"
              variant="gold"
              onClick={() => navigate("/billing")}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 px-5 lg:px-8 py-6 lg:py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
