import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FavoriteAyah, Plan, RecentAyah } from "./types";

type Route =
  | "landing"
  | "login"
  | "register"
  | "verify"
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
  | "quran-favorites";

const FAVORITES_KEY = "quran-favorites";
const RECENT_KEY = "quran-recent";
const RECENT_LIMIT = 15;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AppState {
  route: Route;
  navigate: (r: Route) => void;
  plan: Plan;
  setPlan: (p: Plan) => void;
  rendersUsed: number;
  incrementRenders: () => void;
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
  const [plan, setPlan] = useState<Plan>("FREE");
  const [rendersUsed, setRendersUsed] = useState(2);
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

  useEffect(() => {
    const h = () => setRoute((prev) => prev);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);

  return (
    <Ctx.Provider
      value={{
        route,
        navigate,
        plan,
        setPlan,
        rendersUsed,
        incrementRenders: () => setRendersUsed((n) => n + 1),
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
