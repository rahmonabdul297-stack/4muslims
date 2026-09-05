import { Suspense, lazy, useEffect } from "react";
import { AppProvider, useApp } from "@/store";
import { ToastProvider } from "@/toast";
import { ThemeProvider } from "@/theme";
import { LanguageProvider } from "@/language";
import { ToastHost } from "@/components/ToastHost";
import { DashboardLayout } from "@/components/Layout";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Auth";
import { Loader2 } from "lucide-react";

// Everything besides the landing/login pages is lazy-loaded so the initial
// bundle only ships what's needed for the first paint.
const RegisterPage = lazy(() =>
  import("@/pages/Auth").then((m) => ({ default: m.RegisterPage })),
);
const VerifyPage = lazy(() =>
  import("@/pages/Auth").then((m) => ({ default: m.VerifyPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/Auth").then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/Auth").then((m) => ({ default: m.ResetPasswordPage })),
);
const PaymentVerifyPage = lazy(() =>
  import("@/pages/PaymentVerify").then((m) => ({
    default: m.PaymentVerifyPage,
  })),
);
const StudioPage = lazy(() =>
  import("@/pages/Studio").then((m) => ({ default: m.StudioPage })),
);
const HistoryPage = lazy(() =>
  import("@/pages/History").then((m) => ({ default: m.HistoryPage })),
);
const IntegrationsPage = lazy(() =>
  import("@/pages/Integrations").then((m) => ({ default: m.IntegrationsPage })),
);
const AutoPostPage = lazy(() =>
  import("@/pages/AutoPost").then((m) => ({ default: m.AutoPostPage })),
);
const BillingPage = lazy(() =>
  import("@/pages/Billing").then((m) => ({ default: m.BillingPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/Settings").then((m) => ({ default: m.SettingsPage })),
);
const QuranHomePage = lazy(() =>
  import("@/pages/QuranHome").then((m) => ({ default: m.QuranHomePage })),
);
const SurahDetailPage = lazy(() =>
  import("@/pages/SurahDetail").then((m) => ({ default: m.SurahDetailPage })),
);
const JuzDetailPage = lazy(() =>
  import("@/pages/JuzDetail").then((m) => ({ default: m.JuzDetailPage })),
);
const PrayerTimesPage = lazy(() =>
  import("@/pages/PrayerTimes").then((m) => ({ default: m.PrayerTimesPage })),
);
const DuasPage = lazy(() =>
  import("@/pages/Duas").then((m) => ({ default: m.DuasPage })),
);
const QuranFavoritesPage = lazy(() =>
  import("@/pages/QuranFavorites").then((m) => ({
    default: m.QuranFavoritesPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.ProfilePage })),
);
const AdminVideosPage = lazy(() =>
  import("@/pages/AdminVideos").then((m) => ({ default: m.AdminVideosPage })),
);

const PUBLIC_ROUTES = new Set([
  "landing",
  "login",
  "register",
  "verify",
  "forgot-password",
  "reset-password",
  "payment-verify",
]);

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-emerald-mint animate-spin" />
    </div>
  );
}

function Router() {
  const { route, authLoading, user, navigate } = useApp();

  // Guard against rendering protected pages when there's no authenticated
  // user (e.g. a login response arrived without a valid session cookie).
  const isProtectedRoute = !PUBLIC_ROUTES.has(route);
  useEffect(() => {
    if (!authLoading && isProtectedRoute && !user) {
      navigate("login");
    }
  }, [authLoading, isProtectedRoute, user, navigate]);

  if (authLoading) return <PageFallback />;

  if (route === "landing") return <LandingPage />;
  if (route === "login") return <LoginPage />;

  if (isProtectedRoute && !user) return <PageFallback />;

  return (
    <Suspense fallback={<PageFallback />}>
      {route === "register" && <RegisterPage />}
      {route === "verify" && <VerifyPage />}
      {route === "forgot-password" && <ForgotPasswordPage />}
      {route === "reset-password" && <ResetPasswordPage />}
      {route === "payment-verify" && <PaymentVerifyPage />}

      {isProtectedRoute && (
        <DashboardLayout>
          {(route === "create" || route === "dashboard") && <StudioPage />}
          {route === "history" && <HistoryPage />}
          {route === "integrations" && <IntegrationsPage />}
          {route === "autopost" && <AutoPostPage />}
          {route === "billing" && <BillingPage />}
          {route === "settings" && <SettingsPage />}
          {route === "quran" && <QuranHomePage />}
          {route === "quran-surah" && <SurahDetailPage />}
          {route === "quran-juz" && <JuzDetailPage />}
          {route === "prayer-times" && <PrayerTimesPage />}
          {route === "duas" && <DuasPage />}
          {route === "quran-favorites" && <QuranFavoritesPage />}
          {route === "profile" && <ProfilePage />}
          {route === "admin-videos" && user?.role === "admin" && (
            <AdminVideosPage />
          )}
        </DashboardLayout>
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppProvider>
            <Router />
            <ToastHost />
          </AppProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
