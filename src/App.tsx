import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useApp } from "@/store";
import { DashboardLayout } from "@/components/Layout";
import { Loader2 } from "lucide-react";

// Synchronous Page Imports
import { LandingPage } from "@/pages/Landing";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyPage,
} from "@/pages/Auth";
import { StudioPage } from "./pages/Studio";
import { HistoryPage } from "./pages/History";
import { IntegrationsPage } from "./pages/Integrations";
import { AutoPostPage } from "./pages/AutoPost";
import { BillingPage } from "./pages/Billing";
import { SettingsPage } from "./pages/Settings";
import { SurahDetailPage } from "./pages/SurahDetail";
import { JuzDetailPage } from "./pages/JuzDetail";
import { PrayerTimesPage } from "./pages/PrayerTimes";
import { DuasPage } from "./pages/Duas";
import { QuranFavoritesPage } from "./pages/QuranFavorites";
import { ProfilePage } from "./pages/Profile";
import { PaymentVerifyPage } from "./pages/PaymentVerify";
import { AdminVideosPage } from "./pages/AdminVideos";
import { QuranHomePage } from "./pages/QuranHome";

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-emerald-mint animate-spin" />
    </div>
  );
}

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

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { authLoading } = useApp();
  if (authLoading) return <PageFallback />;
  return <>{children}</>;
}

export default function App() {
  const { user } = useApp();

  return (
    <Routes>
      {/* 1. Public Auth & Marketing Routes */}
      <Route
        path="/landing"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <PublicRoute>
            <VerifyPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/payment-verify"
        element={
          <PublicRoute>
            <PaymentVerifyPage />
          </PublicRoute>
        }
      />

      {/* 2. Protected Dashboard Routes */}
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

        {/* Admin Route */}
        {user?.role === "admin" && (
          <Route path="/admin-videos" element={<AdminVideosPage />} />
        )}
      </Route>

      {/* 3. Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
