import { Heart, Clock } from "lucide-react";
import { GlassCard, Button, EmptyState, Badge } from "@/components/ui";
import { useApp } from "@/store";

export function QuranFavoritesPage() {
  const { favorites, toggleFavorite, recent, openSurah } = useApp();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Badge tone="emerald">Free for everyone</Badge>
        <span className="text-xs text-slate-500">
          Saved locally on this device
        </span>
      </div>

      <h3 className="text-sm font-semibold text-ink-text mb-3 flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-400" /> Favorite ayahs
      </h3>
      {favorites.length === 0 ? (
        <GlassCard className="py-8 mb-8">
          <EmptyState
            icon={<Heart className="w-7 h-7" />}
            title="No favorites yet"
            description="Ayahs you save while reading will appear here."
          />
        </GlassCard>
      ) : (
        <div className="space-y-4 mb-8">
          {favorites.map((f) => (
            <GlassCard key={f.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <button
                  onClick={() => openSurah(f.surah)}
                  className="text-xs font-medium text-emerald-400 hover:underline"
                >
                  {f.surahName} &middot; Ayah {f.ayah}
                </button>
                <button
                  onClick={() => toggleFavorite(f)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-ink-text transition"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <p className="font-arabic text-2xl text-ink-text leading-loose text-right mb-3">
                {f.text}
              </p>
              <p className="text-sm text-slate-400">{f.translation}</p>
            </GlassCard>
          ))}
        </div>
      )}

      <h3 className="text-sm font-semibold text-ink-text mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-400" /> Recently read
      </h3>
      {recent.length === 0 ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<Clock className="w-7 h-7" />}
            title="No recent activity"
            description="Surahs and juz you open will be listed here."
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recent.map((r) => (
            <GlassCard key={r.id} hover className="p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => openSurah(r.surah)}
              >
                <span>
                  {r.surahName} &middot; Ayah {r.ayah}
                </span>
              </Button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
