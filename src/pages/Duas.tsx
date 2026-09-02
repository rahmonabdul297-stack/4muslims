import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle, HandHeart } from "lucide-react";
import { GlassCard, Input, Badge, EmptyState } from "@/components/ui";
import { fetchDuaCategories, fetchDuasByCategory } from "@/lib/duaApi";
import type { DuaCategory, DuaItem } from "@/types";

export function DuasPage() {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDuas, setLoadingDuas] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchDuaCategories()
      .then((data) => {
        setCategories(data);
        if (data[0]) setActiveCategory(data[0].slug);
      })
      .catch(() => setError("Unable to load dua categories."))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingDuas(true);
    setError("");
    fetchDuasByCategory(activeCategory)
      .then(setDuas)
      .catch(() => setError("Unable to load duas for this category."))
      .finally(() => setLoadingDuas(false));
  }, [activeCategory]);

  const filtered = useMemo(
    () =>
      duas.filter(
        (d) =>
          !query.trim() ||
          d.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [duas, query],
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Badge tone="emerald">Free for everyone</Badge>
        <span className="text-xs text-slate-500">
          Daily duas and after-salah dhikr
        </span>
      </div>

      {loadingCategories ? (
        <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading categories...
        </div>
      ) : (
        <div className="flex gap-1.5 glass rounded-xl p-1 mb-4 overflow-x-auto scrollbar-thin">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCategory(c.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeCategory === c.slug
                  ? "bg-emerald-mint/15 text-emerald-400"
                  : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.04]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search duas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loadingDuas ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading duas...
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
            icon={<HandHeart className="w-7 h-7" />}
            title="No duas found"
            description="Try a different search or category."
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <GlassCard key={d.id} className="p-5">
              <h3 className="text-sm font-semibold text-ink-text mb-3">
                {d.title}
              </h3>
              <p className="font-arabic text-2xl text-ink-text leading-loose text-right mb-3">
                {d.arabic}
              </p>
              <p className="text-sm text-slate-400 italic mb-2">{d.latin}</p>
              <p className="text-sm text-slate-300">{d.translation}</p>
              {d.notes && (
                <p className="text-xs text-emerald-400 mt-3">{d.notes}</p>
              )}
              {d.source && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Source: {d.source}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
