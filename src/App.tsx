import { AppProvider, useApp } from "@/store";
import { ToastProvider } from "@/toast";
import { ThemeProvider } from "@/theme";
import { LanguageProvider } from "@/language";
import { ToastHost } from "@/components/ToastHost";
import { DashboardLayout } from "@/components/Layout";
import { LandingPage } from "@/pages/Landing";
import { StudioPage } from "@/pages/Studio";
import { HistoryPage } from "@/pages/History";
import { IntegrationsPage } from "@/pages/Integrations";
import { AutoPostPage } from "@/pages/AutoPost";
import { BillingPage } from "@/pages/Billing";
import { SettingsPage } from "@/pages/Settings";
import { LoginPage, RegisterPage, VerifyPage } from "@/pages/Auth";
import { QuranHomePage } from "@/pages/QuranHome";
import { SurahDetailPage } from "@/pages/SurahDetail";
import { JuzDetailPage } from "@/pages/JuzDetail";
import { PrayerTimesPage } from "@/pages/PrayerTimes";
import { DuasPage } from "@/pages/Duas";
import { QuranFavoritesPage } from "@/pages/QuranFavorites";

function Router() {
  const { route } = useApp();

  if (route === "landing") return <LandingPage />;
  if (route === "login") return <LoginPage />;
  if (route === "register") return <RegisterPage />;
  if (route === "verify") return <VerifyPage />;

  return (
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
    </DashboardLayout>
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
