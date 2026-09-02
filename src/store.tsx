import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FavoriteAyah, RecentAyah, User } from "./types";
import { getMe, logout as apiLogout } from "./lib/authApi";

type Route =
  | "landing"
  | "login"
  | "register"
  | "verify"
  | "forgot-password"
  | "reset-password"
  | "payment-verify"
  | "dashboard"
  | "create"
  | "history"
  | "autopost"
  | "integrations"
  | "billing"
  | "settings"
  | "quran"
  | "quran-surah"
  | "quran-juz"
  | "prayer-times"
  | "duas"
  | "quran-favorites"
  | "profile"
  | "admin-videos";

const FAVORITES_KEY = "quran-favorites";
const RECENT_KEY = "quran-recent";
const RECENT_LIMIT = 15;

type OAuthNotice = { type: "success" | "error"; message?: string };

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Reads the real-URL landmarks the backend redirects to (OAuth/payment callbacks), then resets the URL to "/". */
function consumeRedirectLandmark(): {
  route: Route | null;
  notice: OAuthNotice | null;
  paymentReference: string | null;
  resetToken: string | null;
} {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  let route: Route | null = null;
  let notice: OAuthNotice | null = null;
  let paymentReference: string | null = null;
  let resetToken: string | null = null;

  if (pathname === "/dashboard") {
    route = "create";
    if (params.get("login") === "google")
      notice = { type: "success", message: "Signed in with Google" };
  } else if (pathname === "/login" && params.has("error")) {
    route = "login";
    notice = {
      type: "error",
      message: params.get("error") ?? "Sign in failed",
    };
  } else if (pathname === "/payment/verify") {
    route = "payment-verify";
    paymentReference = params.get("reference");
  } else if (pathname === "/reset-password" && params.has("token")) {
    route = "reset-password";
    resetToken = params.get("token");
  }

  if (pathname !== "/") {
    window.history.replaceState({}, "", "/");
  }

  return { route, notice, paymentReference, resetToken };
}

interface AppState {
  route: Route;
  navigate: (r: Route) => void;
  user: User | null;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  oauthNotice: OAuthNotice | null;
  clearOauthNotice: () => void;
  paymentReference: string | null;
  resetToken: string | null;
  quranSurahNumber: number;
  quranJuzNumber: number;
  openSurah: (n: number) => void;
  openJuz: (n: number) => void;
  favorites: FavoriteAyah[];
  toggleFavorite: (ayah: FavoriteAyah) => void;
  isFavorite: (surah: number, ayah: number) => boolean;
  recent: RecentAyah[];
  addRecent: (item: Omit<RecentAyah, "id" | "visitedAt">) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [oauthNotice, setOauthNotice] = useState<OAuthNotice | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [quranSurahNumber, setQuranSurahNumber] = useState(1);
  const [quranJuzNumber, setQuranJuzNumber] = useState(1);
  const [favorites, setFavorites] = useState<FavoriteAyah[]>(() =>
    readStorage(FAVORITES_KEY, []),
  );
  const [recent, setRecent] = useState<RecentAyah[]>(() =>
    readStorage(RECENT_KEY, []),
  );

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  const openSurah = (n: number) => {
    setQuranSurahNumber(n);
    navigate("quran-surah");
  };

  const openJuz = (n: number) => {
    setQuranJuzNumber(n);
    navigate("quran-juz");
  };

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
    navigate("landing");
  };

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const landmark = consumeRedirectLandmark();
      if (landmark.notice) setOauthNotice(landmark.notice);
      if (landmark.paymentReference)
        setPaymentReference(landmark.paymentReference);
      if (landmark.resetToken) setResetToken(landmark.resetToken);

      try {
        const me = await getMe();
        if (cancelled) return;
        setUser(me);
        setRoute(landmark.route ?? "create");
      } catch {
        if (cancelled) return;
        setUser(null);
        // A /dashboard landmark implies an OAuth redirect expected a session — bounce to login instead.
        if (landmark.route && landmark.route !== "create") {
          setRoute(landmark.route);
        } else if (landmark.route === "create") {
          setRoute("login");
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [recent]);

  const isFavorite = (surah: number, ayah: number) =>
    favorites.some((f) => f.surah === surah && f.ayah === ayah);

  const toggleFavorite = (ayah: FavoriteAyah) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === ayah.id)
        ? prev.filter((f) => f.id !== ayah.id)
        : [ayah, ...prev],
    );
  };

  const addRecent = (item: Omit<RecentAyah, "id" | "visitedAt">) => {
    const id = `${item.surah}-${item.ayah}`;
    setRecent((prev) => {
      const next = [
        { ...item, id, visitedAt: new Date().toISOString() },
        ...prev.filter((r) => r.id !== id),
      ];
      return next.slice(0, RECENT_LIMIT);
    });
  };

  return (
    <Ctx.Provider
      value={{
        route,
        navigate,
        user,
        authLoading,
        refreshUser,
        logout,
        oauthNotice,
        clearOauthNotice: () => setOauthNotice(null),
        paymentReference,
        resetToken,
        quranSurahNumber,
        quranJuzNumber,
        openSurah,
        openJuz,
        favorites,
        toggleFavorite,
        isFavorite,
        recent,
        addRecent,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { Route };
