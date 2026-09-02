import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Mic,
  Lock,
  Sparkles,
  Play,
  Download,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  GlassCard,
  Badge,
  Select,
  Input,
  Field,
  ProgressRing,
  Modal,
  EmptyState,
} from "@/components/ui";
import { VideoCardThumb } from "@/components/TemplateThumb";
import { surahs, reciters, templates, planTierLimits } from "@/data";
import { useApp } from "@/store";
import { useToast } from "@/toast";
import { ApiError } from "@/lib/apiClient";
import { generateVideo, getVideoStatus } from "@/lib/videoApi";
import { getAdminVideos } from "@/lib/adminApi";
import type { GeneratedVideo, VideoJobStatus } from "@/types";

export function StudioPage() {
  const { user, refreshUser } = useApp();
  const { push } = useToast();
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [reciter, setReciter] = useState(reciters[0].id);
  const [templateId, setTemplateId] = useState("");
  const [videoTemplates, setVideoTemplates] = useState<GeneratedVideo[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState("");
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [arabicOverride, setArabicOverride] = useState("");
  const [translationOverride, setTranslationOverride] = useState("");
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | VideoJobStatus>("idle");
  const [outputUrl, setOutputUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pollTimeout.current) clearTimeout(pollTimeout.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    getAdminVideos()
      .then((data) => {
        if (cancelled) return;
        setVideoTemplates(data);
        if (data.length) setTemplateId((prev) => prev || data[0]._id);
      })
      .catch((err) => {
        if (!cancelled) {
          setTemplatesError(
            err instanceof ApiError ? err.message : "Unable to load templates.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setTemplatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSurah = surahs.find((s) => s.number === surah)!;
  const selectedTemplate = videoTemplates.find((v) => v._id === templateId);
  const selectedTemplateStyle = templates.find(
    (t) => t.id === selectedTemplate?.templateId,
  );
  const plan = user?.plan ?? "FREE";
  const limits = planTierLimits[plan];
  const limit = limits.manualRendersPerMonth;
  const rendersUsed = user?.monthlyUsage?.manualGenerationsCount ?? 0;
  const atLimit = limit !== -1 && rendersUsed >= limit;

  const pollStatus = (jobId: string) => {
    pollTimeout.current = setTimeout(async () => {
      try {
        const res = await getVideoStatus(jobId);
        setStatus(res.status);
        setProgress(res.progress ?? 0);
        if (res.status === "completed") {
          setOutputUrl(res.outputUrl);
          refreshUser();
          push("Video render completed successfully!", "success");
        } else if (res.status === "failed") {
          setErrorMessage(
            res.errorMessage || "Rendering failed. Please try again.",
          );
          push(
            res.errorMessage || "Rendering failed. Please try again.",
            "error",
          );
        } else {
          pollStatus(jobId);
        }
      } catch (err) {
        setStatus("failed");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Lost connection while checking render status.",
        );
      }
    }, 2500);
  };

  const startRender = async () => {
    if (atLimit) {
      push(
        "You have reached your monthly render limit. Upgrade to continue.",
        "error",
      );
      return;
    }
    if (!templateId) {
      push("Choose a template first", "error");
      return;
    }
    if (ayah > selectedSurah.ayahs) {
      push(`Ayah must be between 1 and ${selectedSurah.ayahs}`, "error");
      return;
    }
    setRendering(true);
    setProgress(0);
    setOutputUrl("");
    setErrorMessage("");
    setStatus("pending");
    try {
      const result = await generateVideo({
        templateId,
        surahNumber: surah,
        ayahNumber: ayah,
        reciterId: reciter,
        arabicText: arabicOverride || undefined,
        translationText: translationOverride || undefined,
        surahName: selectedSurah.name,
      });
      setStatus(result.status);
      pollStatus(result.jobId);
    } catch (err) {
      setStatus("failed");
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to start rendering. Please try again.";
      setErrorMessage(message);
      push(message, "error");
    }
  };

  const statusSteps = [
    { label: "Pending", icon: Clock, active: true },
    {
      label: "Processing",
      icon: Loader2,
      active: status === "processing" || status === "completed",
    },
    { label: "Completed", icon: CheckCircle2, active: status === "completed" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Verse & Reciter */}
        <div className="lg:col-span-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-mint/15 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-mint" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-text">
                  Verse & Reciter
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select your Quranic verse
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Field label="Surah">
                <Select
                  value={surah}
                  onChange={(e) => {
                    setSurah(Number(e.target.value));
                    setAyah(1);
                  }}
                >
                  {surahs.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.name} — {s.arabic} ({s.ayahs} ayahs)
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Ayah Number">
                  <Input
                    type="number"
                    min={1}
                    max={selectedSurah.ayahs}
                    value={ayah}
                    onChange={(e) => setAyah(Number(e.target.value))}
                  />
                </Field>
                <Field label="Reciter">
                  <Select
                    value={reciter}
                    onChange={(e) => setReciter(e.target.value)}
                  >
                    {reciters.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              {reciter && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ink-overlay/[0.03] border border-ink-overlay/[0.05]">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-text truncate">
                      {reciters.find((r) => r.id === reciter)?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {reciters.find((r) => r.id === reciter)?.style}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setOverrideOpen(!overrideOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.03] transition border border-ink-overlay/[0.05]"
              >
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5" />
                  Custom text overrides (optional)
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${overrideOpen ? "rotate-180" : ""}`}
                />
              </button>

              {overrideOpen && (
                <div className="space-y-3 animate-fade-in pl-4 border-l border-emerald-mint/20">
                  <Field
                    label="Arabic Text Override"
                    hint="Leave empty to auto-fetch"
                  >
                    <Input
                      value={arabicOverride}
                      onChange={(e) => setArabicOverride(e.target.value)}
                      placeholder="بسم الله الرحمن الرحيم"
                      className="font-arabic text-base"
                    />
                  </Field>
                  <Field
                    label="Translation Override"
                    hint="English / your language"
                  >
                    <Input
                      value={translationOverride}
                      onChange={(e) => setTranslationOverride(e.target.value)}
                      placeholder="In the name of Allah, the Most Gracious..."
                    />
                  </Field>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Panel 2: Template Selector */}
        <div className="lg:col-span-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-light" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-text">
                  Template
                </h3>
                <p className="text-[11px] text-slate-500">
                  Vertical 9:16 video style
                </p>
              </div>
            </div>

            {templatesLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading
                templates...
              </div>
            ) : templatesError ? (
              <EmptyState
                icon={<AlertCircle className="w-7 h-7" />}
                title="Couldn't load templates"
                description={templatesError}
              />
            ) : videoTemplates.length === 0 ? (
              <EmptyState
                icon={<Sparkles className="w-7 h-7" />}
                title="No templates available"
                description="No admin-published templates were found yet."
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto scrollbar-thin pr-1">
                {videoTemplates.map((t) => {
                  const style = templates.find(
                    (tpl) => tpl.id === t.templateId,
                  );
                  return (
                    <button
                      key={t._id}
                      onClick={() => setTemplateId(t._id)}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        templateId === t._id
                          ? "border-emerald-mint shadow-glow scale-[1.02]"
                          : "border-transparent hover:border-ink-overlay/20 hover:scale-[1.02]"
                      }`}
                    >
                      <VideoCardThumb
                        gradient={
                          style?.gradient ?? "from-emerald-deep to-emerald-mint"
                        }
                        arabicText={t.arabicText || selectedSurah.arabic}
                        className="aspect-[9/16]"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                        <p className="text-[10px] font-medium text-white text-left truncate">
                          {style?.name ?? t.templateId}
                        </p>
                        <p className="text-[8px] text-white/60 text-left truncate">
                          Surah {t.surahNumber}
                          {t.surahName ? `: ${t.surahName}` : ""}
                        </p>
                      </div>
                      {templateId === t._id && (
                        <div className="absolute top-1.5 left-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-mint fill-emerald-mint/20" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Panel 3: Live Config & Generation */}
        <div className="lg:col-span-4">
          <GlassCard className="p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-mint/15 flex items-center justify-center">
                <Play className="w-4 h-4 text-emerald-mint" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-text">
                  Configure & Generate
                </h3>
                <p className="text-[11px] text-slate-500">Review & render</p>
              </div>
            </div>

            <div
              className={`rounded-xl p-3 mb-4 border ${
                plan === "FREE"
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-emerald-mint/5 border-emerald-mint/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {plan === "FREE" ? (
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-mint" />
                )}
                <span className="text-xs font-medium text-ink-text">
                  Plan: {plan}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-ink-overlay/[0.03] py-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">
                    Max Duration
                  </p>
                  <p className="text-xs font-semibold text-ink-text">
                    {limits.maxClipSeconds}s
                  </p>
                </div>
                <div className="rounded-lg bg-ink-overlay/[0.03] py-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">
                    Auto-Post/mo
                  </p>
                  <p className="text-xs font-semibold text-ink-text">
                    {limits.autoPostsPerMonth === -1
                      ? "∞"
                      : limits.autoPostsPerMonth}
                  </p>
                </div>
                <div className="rounded-lg bg-ink-overlay/[0.03] py-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">
                    Watermark
                  </p>
                  <p
                    className={`text-xs font-semibold ${limits.watermark ? "text-amber-400" : "text-emerald-mint"}`}
                  >
                    {limits.watermark ? "Yes" : "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 mb-4 text-xs">
              <Row label="Surah" value={`${surah}. ${selectedSurah.name}`} />
              <Row label="Ayah" value={String(ayah)} />
              <Row
                label="Reciter"
                value={reciters.find((r) => r.id === reciter)?.name ?? ""}
              />
              <Row
                label="Template"
                value={
                  selectedTemplateStyle?.name ??
                  selectedTemplate?.templateId ??
                  "—"
                }
              />
            </div>

            {atLimit && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300">
                  You've used all {limit} monthly renders. Upgrade your plan to
                  continue.
                </p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={startRender}
              disabled={atLimit || rendering || !templateId}
              loading={rendering}
            >
              <Sparkles className="w-4 h-4" />
              Generate Video
            </Button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              {limit === -1 ? "Unlimited" : `${rendersUsed}/${limit}`} renders
              used this month
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Render Progress Modal */}
      <Modal
        open={rendering}
        onClose={() => {
          if (status === "completed" || status === "failed")
            setRendering(false);
        }}
        className="max-w-md"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-ink-text mb-1">
            Rendering Your Video
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {selectedSurah.name} · Ayah {ayah} ·{" "}
            {reciters.find((r) => r.id === reciter)?.name}
          </p>

          <div className="flex flex-col items-center gap-5">
            <ProgressRing progress={progress} size={140} />

            <div className="flex items-center gap-2 w-full">
              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex-1 flex items-center gap-1"
                  >
                    <div
                      className={`flex items-center gap-1.5 ${step.active ? "text-emerald-mint" : "text-slate-600"}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${step.active && i === 1 ? "animate-spin" : ""}`}
                      />
                      <span className="text-[11px] font-medium">
                        {step.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className="flex-1 h-px bg-ink-overlay/10" />
                    )}
                  </div>
                );
              })}
            </div>

            {status === "completed" ? (
              <div className="w-full">
                <div className="relative rounded-xl overflow-hidden bg-ink-page border border-ink-overlay/10 mb-3 aspect-video">
                  {outputUrl ? (
                    <video
                      src={outputUrl}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <VideoCardThumb
                      gradient={
                        selectedTemplateStyle?.gradient ??
                        "from-emerald-deep to-emerald-mint"
                      }
                      arabicText={selectedSurah.arabic}
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => setRendering(false)}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Done
                  </Button>
                  <a
                    href={outputUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      <Download className="w-3.5 h-3.5" />
                      Download MP4
                    </Button>
                  </a>
                </div>
              </div>
            ) : status === "failed" ? (
              <div className="w-full text-center">
                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-3 text-left">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300">
                    {errorMessage || "Rendering failed. Please try again."}
                  </p>
                </div>
                <Button className="w-full" onClick={() => setRendering(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <Badge tone="emerald">
                <Loader2 className="w-3 h-3 animate-spin" />
                {status === "pending"
                  ? "Queued for processing..."
                  : "Rendering frames..."}
              </Badge>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-ink-text">{value}</span>
    </div>
  );
}
