import { useState, useMemo } from "react";
import {
  Search,
  Play,
  Download,
  Film,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { GlassCard, Badge, Input, Button, EmptyState } from "@/components/ui";
import { VideoCardThumb } from "@/components/TemplateThumb";
import { sampleVideos } from "@/data";
import { useToast } from "@/toast";
import type { RenderStatus } from "@/types";

const filters: (RenderStatus | "All")[] = [
  "All",
  "Completed",
  "Processing",
  "Failed",
];

const statusConfig: Record<
  RenderStatus,
  { tone: "emerald" | "amber" | "red"; icon: typeof CheckCircle2 }
> = {
  Completed: { tone: "emerald", icon: CheckCircle2 },
  Processing: { tone: "amber", icon: Loader2 },
  Failed: { tone: "red", icon: XCircle },
  Pending: { tone: "amber", icon: Loader2 },
};

export function HistoryPage() {
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(
    () =>
      sampleVideos.filter((v) => {
        const matchQ =
          v.surahName.toLowerCase().includes(query.toLowerCase()) ||
          v.reciter.toLowerCase().includes(query.toLowerCase());
        const matchF = filter === "All" || v.status === filter;
        return matchQ && matchF;
      }),
    [query, filter],
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by surah or reciter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5 glass rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === f
                  ? "bg-emerald-mint/15 text-emerald-400"
                  : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.04]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<Film className="w-7 h-7" />}
            title="No videos found"
            description="Try adjusting your search or filter. Videos you render will appear here."
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((v) => {
            const cfg = statusConfig[v.status];
            const StatusIcon = cfg.icon;
            return (
              <GlassCard
                key={v.id}
                hover
                className="p-3 group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <VideoCardThumb
                    gradient={v.thumbnail}
                    arabicText="بسم الله"
                    status={v.status}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button className="w-11 h-11 rounded-full bg-emerald-mint/90 flex items-center justify-center hover:scale-110 transition">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge tone="neutral">
                      Surah {v.surah}: {v.surahName}
                    </Badge>
                    <span className="text-[10px] text-slate-500">
                      Ayah {v.ayah}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {v.reciter} · {v.template}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge tone={cfg.tone}>
                      <StatusIcon
                        className={`w-3 h-3 ${v.status === "Processing" ? "animate-spin" : ""}`}
                      />
                      {v.status}
                    </Badge>
                    <span className="text-[10px] text-slate-500">
                      {new Date(v.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {v.duration}s
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={v.status !== "Completed"}
                      onClick={() => push("Playing preview...", "info")}
                    >
                      <Play className="w-3 h-3" /> Play
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={v.status !== "Completed"}
                      onClick={() => push("Download started", "success")}
                    >
                      <Download className="w-3 h-3" /> MP4
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
