import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { AppProvider, useApp } from "@/store";
import { ToastProvider } from "@/toast";
import { ThemeProvider } from "@/theme";
import { LanguageProvider } from "@/language";
import { ToastHost } from "@/components/ToastHost";
import { DashboardLayout } from "@/components/Layout";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Auth";
import { Loader2 } from "lucide-react";

// Lazy-loaded components
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

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-emerald-mint animate-spin" />
    </div>
  );
}

// Wrapper to secure protected routes
function ProtectedLayout() {
  const { authLoading, user } = useApp();

  if (authLoading) return <PageFallback />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

// Wrapper to prevent logged-in users from seeing login/landing if needed,
// or simply rendering public routes with authentication checks
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { authLoading } = useApp();
  if (authLoading) return <PageFallback />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/verify" element={<PublicRoute><VerifyPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path="/payment-verify" element={<PublicRoute><PaymentVerifyPage /></PublicRoute>} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<StudioPage />} />
          <Route path="/create" element={<StudioPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/autopost" element={<AutoPostPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/quran" element={<QuranHomePage />} />
          <Route path="/quran-surah" element={<SurahDetailPage />} />
          <Route path="/quran-juz" element={<JuzDetailPage />} />
          <Route path="/prayer-times" element={<PrayerTimesPage />} />
          <Route path="/duas" element={<DuasPage />} />
          <Route path="/quran-favorites" element={<QuranFavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {user?.role === "admin" && (
            <Route path="/admin-videos" element={<AdminVideosPage />} />
          )}
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
<ThemeProvider>
  <LanguageProvider>
    <ToastProvider>
      <AppProvider>         
        <BrowserRouter>
          <AppRoutes />      
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  </LanguageProvider>
</ThemeProvider>
  );
}