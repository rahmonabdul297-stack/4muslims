import { useEffect, useState } from "react";
import { Zap, Lock, Youtube, Music2, Facebook, Send, Save } from "lucide-react";
import {
  GlassCard,
  Badge,
  Button,
  Toggle,
  Select,
  Modal,
} from "@/components/ui";
import { reciters } from "@/data";
import { useApp } from "@/store";
import { useToast } from "@/toast";
import { ApiError } from "@/lib/apiClient";
import { updateAutoPostSettings, triggerAutoPost } from "@/lib/videoApi";
import type { AutoPostPlatform } from "@/types";

export function AutoPostPage() {
  const { user, navigate, refreshUser } = useApp();
  const { push } = useToast();
  const [enabled, setEnabled] = useState(
    user?.autoPostSettings?.enabled ?? false,
  );
  const [selectedPlatform, setSelectedPlatform] = useState<AutoPostPlatform>(
    user?.autoPostSettings?.selectedPlatform ?? "youtube",
  );
  const [defaultReciter, setDefaultReciter] = useState(
    user?.autoPostSettings?.defaultReciterId ?? reciters[0].id,
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEnabled(user.autoPostSettings?.enabled ?? false);
    setSelectedPlatform(user.autoPostSettings?.selectedPlatform ?? "youtube");
    setDefaultReciter(
      user.autoPostSettings?.defaultReciterId ?? reciters[0].id,
    );
  }, [user]);

  const isLocked = (user?.plan ?? "FREE") === "FREE";

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await updateAutoPostSettings({
        enabled,
        selectedPlatform,
        defaultReciterId: defaultReciter,
      });
      push(res.message || "Auto-Post settings saved", "success");
      await refreshUser();
    } catch (err) {
      push(
        err instanceof ApiError
          ? err.message
          : "Unable to save auto-post settings.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const triggerNow = async () => {
    setTriggering(true);
    try {
      await triggerAutoPost();
      push("Post triggered manually", "success");
      await refreshUser();
    } catch (err) {
      push(
        err instanceof ApiError
          ? err.message
          : "Unable to trigger auto-post right now.",
        "error",
      );
    } finally {
      setTriggering(false);
    }
  };

  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto relative">
        <div className="filter blur-sm pointer-events-none select-none opacity-60">
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-40 bg-ink-overlay/[0.06] rounded" />
              <div className="h-6 w-12 bg-ink-overlay/[0.06] rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-ink-overlay/[0.04] rounded-xl"
                />
              ))}
            </div>
            <div className="h-10 bg-ink-overlay/[0.06] rounded-xl" />
          </GlassCard>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <GlassCard className="p-8 max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-gold-light" />
            </div>
            <h3 className="text-lg font-bold text-ink-text mb-2">
              Upgrade to PRO to unlock Daily Auto-Posting
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              Automatically publish your AI-generated Quran verse videos to
              YouTube Shorts, TikTok, and Facebook — every day, on schedule.
            </p>
            <div className="flex items-center justify-center gap-2 mb-5">
              <Badge tone="gold">
                <Zap className="w-3 h-3" />
                PRO Plan
              </Badge>
              <span className="text-xs text-slate-500">from ₦5,000/mo</span>
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate("/billing")}
            >
              <Lock className="w-4 h-4" />
              Upgrade to PRO
            </Button>
            <button
              onClick={() => setShowPaywall(true)}
              className="block mx-auto mt-3 text-xs text-slate-500 hover:text-slate-300"
            >
              See what's included
            </button>
          </GlassCard>
        </div>

        <Modal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          className="max-w-md"
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-ink-text mb-4">
              Auto-Post Features
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                "Auto-post to one platform of your choice (YouTube, TikTok, or Facebook)",
                "PRO: up to 5 auto-posts/month · ULTIMATE: up to 30/month (~daily)",
                "Choose default reciter voice for auto-generated posts",
                'Manual "trigger now" post button',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-mint mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="gold"
              className="w-full mt-5"
              onClick={() => navigate("/billing")}
            >
              Upgrade Now
            </Button>
          </div>
        </Modal>
      </div>
    );
  }

  const platformCards: {
    id: AutoPostPlatform;
    name: string;
    icon: typeof Youtube;
  }[] = [
    { id: "youtube", name: "YouTube Shorts", icon: Youtube },
    { id: "tiktok", name: "TikTok", icon: Music2 },
    { id: "facebook", name: "Facebook Reels", icon: Facebook },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GlassCard className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-mint/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-mint" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-text">
              Master Auto-Post
            </h3>
            <p className="text-xs text-slate-500">
              Enable or disable all automated publishing
            </p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </GlassCard>

      <GlassCard className="p-5">
        <h4 className="text-sm font-semibold text-ink-text mb-1">
          Target Platform
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Choose the single platform your videos get auto-published to
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {platformCards.map((p) => {
            const Icon = p.icon;
            const active = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`relative rounded-xl p-4 border-2 transition-all text-left ${
                  active
                    ? "border-emerald-mint bg-emerald-mint/5 shadow-glow"
                    : "border-ink-overlay/[0.06] bg-ink-overlay/[0.02] hover:border-ink-overlay/15"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-2 ${active ? "text-emerald-mint" : "text-slate-400"}`}
                />
                <p className="text-xs font-medium text-ink-text">{p.name}</p>
                <div
                  className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition ${
                    active
                      ? "border-emerald-mint bg-emerald-mint"
                      : "border-ink-overlay/20"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h4 className="text-sm font-semibold text-ink-text mb-1">
          Default Reciter
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          Voice used for auto-generated verse videos
        </p>
        <Select
          value={defaultReciter}
          onChange={(e) => setDefaultReciter(e.target.value)}
        >
          {reciters.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.style}
            </option>
          ))}
        </Select>
      </GlassCard>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          loading={triggering}
          disabled={triggering || !enabled}
          onClick={triggerNow}
        >
          <Send className="w-4 h-4" />
          Trigger Post Now
        </Button>
        <Button
          className="flex-1"
          loading={saving}
          disabled={saving}
          onClick={saveSettings}
        >
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
