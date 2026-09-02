import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Play,
  Download,
  Film,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { GlassCard, Badge, Input, Button, EmptyState } from "@/components/ui";
import { VideoCardThumb } from "@/components/TemplateThumb";
import { templates, reciters } from "@/data";
import { useToast } from "@/toast";
import { getVideoHistory } from "@/lib/videoApi";
import { ApiError } from "@/lib/apiClient";
import type { GeneratedVideo, VideoJobStatus } from "@/types";

const filters: (VideoJobStatus | "all")[] = [
  "all",
  "completed",
  "processing",
  "pending",
  "failed",
];

const statusConfig: Record<
  VideoJobStatus,
  {
    tone: "emerald" | "amber" | "red";
    icon: typeof CheckCircle2;
    label: string;
  }
> = {
  completed: { tone: "emerald", icon: CheckCircle2, label: "Completed" },
  processing: { tone: "amber", icon: Loader2, label: "Processing" },
  pending: { tone: "amber", icon: ClockIcon, label: "Pending" },
  failed: { tone: "red", icon: XCircle, label: "Failed" },
};

export function HistoryPage() {
  const { push } = useToast();
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  useEffect(() => {
    let cancelled = false;
    getVideoHistory()
      .then((data) => {
        if (!cancelled) setVideos(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof ApiError
              ? err.message
              : "Unable to load your video history.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      videos.filter((v) => {
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          (v.surahName ?? `surah ${v.surahNumber}`).toLowerCase().includes(q) ||
          v.reciterId.toLowerCase().includes(q);
        const matchF = filter === "all" || v.status === filter;
        return matchQ && matchF;
      }),
    [videos, query, filter],
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
        <div className="flex gap-1.5 glass rounded-xl p-1 overflow-x-auto scrollbar-thin">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition ${
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

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your videos...
        </div>
      ) : error ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<Film className="w-7 h-7" />}
            title="Something went wrong"
            description={error}
          />
        </GlassCard>
      ) : filtered.length === 0 ? (
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
            const template = templates.find((t) => t.id === v.templateId);
            const reciter = reciters.find((r) => r.id === v.reciterId);
            return (
              <GlassCard
                key={v._id}
                hover
                className="p-3 group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                
                  <video 
                  className="h-[50%]"
                 autoPlay muted
                  >
                    <source src={v.outputUrl}/>
                  </video>
                  {v.status === "completed" && v.outputUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <a
                        href={v.outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-emerald-mint/90 flex items-center justify-center hover:scale-110 transition"
                      >
                        <Play className="w-5 h-5 text-white fill-white" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge tone="neutral">
                      Surah {v.surahNumber}
                      {v.surahName ? `: ${v.surahName}` : ""}
                    </Badge>
                    <span className="text-[10px] text-slate-500">
                      Ayah {v.ayahNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {reciter?.name ?? v.reciterId} ·{" "}
                    {template?.name ?? v.templateId}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge tone={cfg.tone}>
                      <StatusIcon
                        className={`w-3 h-3 ${v.status === "processing" ? "animate-spin" : ""}`}
                      />
                      {cfg.label}
                    </Badge>
                    <span className="text-[10px] text-slate-500">
                      {new Date(v.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={v.status !== "completed" || !v.outputUrl}
                      onClick={() => {
                        if (v.outputUrl)
                          window.open(
                            v.outputUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                      }}
                    >
                      <Play className="w-3 h-3" /> Play
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      disabled={v.status !== "completed" || !v.outputUrl}
                      onClick={() => {
                        if (!v.outputUrl) return;
                        push("Download started", "success");
                        window.open(
                          v.outputUrl,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
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
