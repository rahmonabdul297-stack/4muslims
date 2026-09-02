import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GlassCard, Button, EmptyState } from "@/components/ui";
import { AudioPlayerBar } from "@/components/AudioPlayerBar";
import { fetchSurahAyahs, fetchAllSurahs } from "@/lib/quranApi";
import { useApp } from "@/store";
import type { AyahData, SurahMeta } from "@/types";

export function SurahDetailPage() {
  const {
    quranSurahNumber,
    openSurah,
    navigate,
    toggleFavorite,
    isFavorite,
    addRecent,
  } = useApp();
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [allSurahs, setAllSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reciterId, setReciterId] = useState("afasy");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setCurrentIndex(0);
    Promise.all([
      fetchSurahAyahs(quranSurahNumber),
      allSurahs.length ? Promise.resolve(allSurahs) : fetchAllSurahs(),
    ])
      .then(([ayahData, surahList]) => {
        if (cancelled) return;
        setAyahs(ayahData);
        setAllSurahs(surahList);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Unable to load this surah. Check your connection and try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quranSurahNumber]);

  useEffect(() => {
    if (ayahs.length) {
      addRecent({
        surah: quranSurahNumber,
        surahName: ayahs[0].surahName,
        ayah: ayahs[0].numberInSurah,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayahs]);

  const surahMeta = useMemo(
    () => allSurahs.find((s) => s.number === quranSurahNumber),
    [allSurahs, quranSurahNumber],
  );
  const canGoPrev = quranSurahNumber > 1;
  const canGoNext = quranSurahNumber < 114;

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="sm" onClick={() => navigate("quran")}>
          <ArrowLeft className="w-4 h-4" /> Back to Quran
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canGoPrev}
            onClick={() => openSurah(quranSurahNumber - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!canGoNext}
            onClick={() => openSurah(quranSurahNumber + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {surahMeta && (
        <GlassCard className="p-6 mb-6 text-center">
          <p className="font-arabic text-3xl text-ink-text mb-2">
            {surahMeta.name}
          </p>
          <h2 className="text-lg font-bold text-ink-text">
            {surahMeta.englishName}
          </h2>
          <p className="text-sm text-slate-500">
            {surahMeta.englishNameTranslation} &middot;{" "}
            {surahMeta.revelationType} &middot; {surahMeta.numberOfAyahs} ayahs
          </p>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading ayahs...
        </div>
      ) : error ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<AlertCircle className="w-7 h-7" />}
            title="Something went wrong"
            description={error}
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {ayahs.map((a, i) => {
            const fav = isFavorite(a.surah, a.numberInSurah);
            return (
              <GlassCard
                key={a.number}
                className={`p-5 transition ${i === currentIndex ? "border-emerald-mint/40 bg-ink-overlay/[0.05]" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <button
                    onClick={() => setCurrentIndex(i)}
                    className="w-8 h-8 shrink-0 rounded-lg bg-emerald-mint/15 flex items-center justify-center text-xs font-bold text-emerald-400"
                  >
                    {a.numberInSurah}
                  </button>
                  <button
                    onClick={() =>
                      toggleFavorite({
                        id: `${a.surah}-${a.numberInSurah}`,
                        surah: a.surah,
                        surahName: a.surahName,
                        ayah: a.numberInSurah,
                        text: a.text,
                        translation: a.translation,
                        addedAt: new Date().toISOString(),
                      })
                    }
                    className={`p-1.5 rounded-lg transition ${fav ? "text-red-400" : "text-slate-500 hover:text-ink-text"}`}
                  >
                    <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                  </button>
                </div>
                <p className="font-arabic text-2xl text-ink-text leading-loose text-right mb-3">
                  {a.text}
                </p>
                <p className="text-sm text-slate-400">{a.translation}</p>
              </GlassCard>
            );
          })}
        </div>
      )}

      {!loading && !error && ayahs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 px-5 lg:px-8 pb-4">
          <div className="max-w-4xl mx-auto">
            <AudioPlayerBar
              ayahs={ayahs}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              reciterId={reciterId}
              onReciterChange={setReciterId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
