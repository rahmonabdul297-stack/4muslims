import { useEffect, useMemo, useState } from "react";
import { Search, BookOpen, Loader2, AlertCircle, Hash } from "lucide-react";
import { GlassCard, Input, Badge, EmptyState } from "@/components/ui";
import { fetchAllSurahs } from "@/lib/quranApi";
import { useApp } from "@/store";
import type { SurahMeta } from "@/types";

type SortMode = "number" | "name" | "ayahs";

export function QuranHomePage() {
  const { openSurah, openJuz } = useApp();
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("number");
  const [tab, setTab] = useState<"surah" | "juz">("surah");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllSurahs()
      .then((data) => {
        if (!cancelled) setSurahs(data);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Unable to load surahs. Check your connection and try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = surahs.filter(
      (s) =>
        !q ||
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.number).includes(q),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.englishName.localeCompare(b.englishName);
      if (sort === "ayahs") return b.numberOfAyahs - a.numberOfAyahs;
      return a.number - b.number;
    });
    return list;
  }, [surahs, query, sort]);

  return (
    <div className="max-w-7xl mx-auto">
      <GlassCard className="p-4 mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Badge tone="emerald">Free for everyone</Badge>
          <span className="text-xs text-slate-500">
            No plan restrictions apply to the Quran reader
          </span>
        </div>
        <div className="flex gap-1.5 glass rounded-xl p-1 w-fit">
          {(["surah", "juz"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                tab === t
                  ? "bg-emerald-mint/15 text-emerald-400"
                  : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.04]"
              }`}
            >
              {t === "surah" ? "Surahs" : "Juz"}
            </button>
          ))}
        </div>
        {tab === "surah" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name or number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-1.5 glass rounded-xl p-1">
              {(["number", "name", "ayahs"] as SortMode[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    sort === s
                      ? "bg-emerald-mint/15 text-emerald-400"
                      : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.04]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {tab === "surah" ? (
        loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading surahs...
          </div>
        ) : error ? (
          <GlassCard className="py-8">
            <EmptyState
              icon={<AlertCircle className="w-7 h-7" />}
              title="Something went wrong"
              description={error}
            />
          </GlassCard>
        ) : filtered.length === 0 ? (
          <GlassCard className="py-8">
            <EmptyState
              icon={<Search className="w-7 h-7" />}
              title="No surahs found"
              description="Try a different search term."
            />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <GlassCard
                key={s.number}
                hover
                className="p-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                <button
                  onClick={() => openSurah(s.number)}
                  className="w-full text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-mint/15 flex items-center justify-center text-sm font-bold text-emerald-400">
                    {s.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-text truncate">
                      {s.englishName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {s.englishNameTranslation} &middot; {s.numberOfAyahs}{" "}
                      ayahs
                    </p>
                  </div>
                  <p className="font-arabic text-lg text-slate-300 shrink-0">
                    {s.name}
                  </p>
                </button>
              </GlassCard>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
            <GlassCard
              key={n}
              hover
              className="p-4 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              <button
                onClick={() => openJuz(n)}
                className="w-full flex flex-col items-center gap-2 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-mint/15 flex items-center justify-center text-emerald-400">
                  <Hash className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-ink-text">Juz {n}</p>
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <BookOpen className="w-3.5 h-3.5" />
        Quran text and translation courtesy of the Al Quran Cloud API.
      </div>
    </div>
  );
}
