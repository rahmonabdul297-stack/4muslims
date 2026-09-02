import { useState } from "react";
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
} from "@/components/ui";
import { TemplateThumbnail } from "@/components/TemplateThumb";
import { surahs, reciters, templates } from "@/data";
import { useApp } from "@/store";
import { useToast } from "@/toast";
import type { Plan } from "@/types";

const planLimits: Record<
  Plan,
  { duration: number; watermark: boolean; resolution: string }
> = {
  FREE: { duration: 15, watermark: true, resolution: "480p" },
  PRO: { duration: 60, watermark: false, resolution: "1080p" },
  ULTIMATE: { duration: 180, watermark: false, resolution: "4K" },
};

export function StudioPage() {
  const { plan, incrementRenders, rendersUsed } = useApp();
  const { push } = useToast();
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [reciter, setReciter] = useState("afasy");
  const [templateId, setTemplateId] = useState("emerald-glow");
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [arabicOverride, setArabicOverride] = useState("");
  const [translationOverride, setTranslationOverride] = useState("");
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "pending" | "processing" | "completed"
  >("idle");

  const selectedSurah = surahs.find((s) => s.number === surah)!;
  const selectedTemplate = templates.find((t) => t.id === templateId)!;
  const limits = planLimits[plan];
  const limit = plan === "FREE" ? 3 : plan === "PRO" ? 50 : Infinity;
  const atLimit = rendersUsed >= limit;

  const startRender = () => {
    if (atLimit) {
      push(
        "You have reached your monthly render limit. Upgrade to continue.",
        "error",
      );
      return;
    }
    if (ayah > selectedSurah.ayahs) {
      push(`Ayah must be between 1 and ${selectedSurah.ayahs}`, "error");
      return;
    }
    setRendering(true);
    setProgress(0);
    setStatus("pending");
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 30) setStatus("processing");
      if (p >= 100) {
        p = 100;
        setStatus("completed");
        clearInterval(interval);
        incrementRenders();
        push("Video render completed successfully!", "success");
      }
      setProgress(Math.min(p, 100));
    }, 400);
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

            <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto scrollbar-thin pr-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    templateId === t.id
                      ? "border-emerald-mint shadow-glow scale-[1.02]"
                      : "border-transparent hover:border-ink-overlay/20 hover:scale-[1.02]"
                  }`}
                >
                  <TemplateThumbnail
                    template={t}
                    surahArabic={selectedSurah.arabic}
                    className="aspect-[9/16]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                    <p className="text-[10px] font-medium text-white text-left truncate">
                      {t.name}
                    </p>
                    <p className="text-[8px] text-white/60 text-left">
                      {t.motion}
                    </p>
                  </div>
                  {templateId === t.id && (
                    <div className="absolute top-1.5 left-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-mint fill-emerald-mint/20" />
                    </div>
                  )}
                </button>
              ))}
            </div>
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
                    {limits.duration}s
                  </p>
                </div>
                <div className="rounded-lg bg-ink-overlay/[0.03] py-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">
                    Resolution
                  </p>
                  <p className="text-xs font-semibold text-ink-text">
                    {limits.resolution}
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
              <Row label="Template" value={selectedTemplate.name} />
              <Row label="Motion" value={selectedTemplate.motion} />
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
              disabled={atLimit || rendering}
              loading={rendering}
            >
              <Sparkles className="w-4 h-4" />
              Generate Video
            </Button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              {limit === Infinity ? "Unlimited" : `${rendersUsed}/${limit}`}{" "}
              renders used this month
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Render Progress Modal */}
      <Modal
        open={rendering}
        onClose={() => status === "completed" && setRendering(false)}
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
                  <TemplateThumbnail
                    template={selectedTemplate}
                    surahArabic={selectedSurah.arabic}
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-ink-overlay/20 backdrop-blur-sm flex items-center justify-center hover:bg-ink-overlay/30 transition">
                      <Play className="w-5 h-5 text-ink-text fill-white" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => setRendering(false)}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Play Preview
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => push("Download started", "success")}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download MP4
                  </Button>
                </div>
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
