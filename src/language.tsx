import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translate, type Language } from "./translations";

const KEY = "4muslims-language";

interface LanguageCtx {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LanguageCtx | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(KEY);
  return stored === "ar" ||
    stored === "ha" ||
    stored === "yo" ||
    stored === "en"
    ? stored
    : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem(KEY, language);
  }, [language]);

  const t = (key: string) => translate(language, key);

  return (
    <Ctx.Provider value={{ language, setLanguage, t }}>{children}</Ctx.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
