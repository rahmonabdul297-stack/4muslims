import { useEffect, useState } from "react";
import {
  Loader2,
  Film,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { GlassCard, Badge, EmptyState } from "@/components/ui";
import { VideoCardThumb } from "@/components/TemplateThumb";
import { templates, reciters } from "@/data";
import { getAdminVideos } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";
import type { GeneratedVideo, VideoJobStatus } from "@/types";

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

export function AdminVideosPage() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getAdminVideos()
      .then((data) => {
        if (!cancelled) setVideos(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof ApiError
              ? err.message
              : "Unable to load all videos.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        Admin view — every user's rendered video, across the whole platform.
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading all videos...
        </div>
      ) : error ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<Film className="w-7 h-7" />}
            title="Something went wrong"
            description={error}
          />
        </GlassCard>
      ) : videos.length === 0 ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<Film className="w-7 h-7" />}
            title="No videos yet"
            description="Rendered videos from every user will appear here."
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((v) => {
            const cfg = statusConfig[v.status];
            const StatusIcon = cfg.icon;
            const template = templates.find((t) => t.id === v.templateId);
            const reciter = reciters.find((r) => r.id === v.reciterId);
            return (
              <GlassCard key={v._id} className="p-3">
                <VideoCardThumb
                  gradient={
                    template?.gradient ?? "from-emerald-deep to-emerald-mint"
                  }
                  arabicText={v.arabicText || "بسم الله"}
                  status={cfg.label}
                />
                <div className="mt-3 space-y-2">
                  <Badge tone="neutral">
                    Surah {v.surahNumber}
                    {v.surahName ? `: ${v.surahName}` : ""}
                  </Badge>
                  <p className="text-xs text-slate-400 truncate">
                    {reciter?.name ?? v.reciterId} ·{" "}
                    {template?.name ?? v.templateId}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    User: {v.userId}
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
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
