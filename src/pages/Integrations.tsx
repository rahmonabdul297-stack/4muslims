import { Youtube, Facebook, Music2, CheckCircle2, Link2 } from "lucide-react";
import { GlassCard, Badge, Button } from "@/components/ui";
import { integrationPlatforms } from "@/data";
import { useApp } from "@/store";
import { socialConnectUrl } from "@/lib/authApi";
import type { AutoPostPlatform } from "@/types";

const platformIcons: Record<AutoPostPlatform, typeof Youtube> = {
  youtube: Youtube,
  tiktok: Music2,
  facebook: Facebook,
};

export function IntegrationsPage() {
  const { user } = useApp();

  const connect = (key: AutoPostPlatform) => {
    window.location.href = socialConnectUrl(key);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrationPlatforms.map((ig) => {
          const Icon = platformIcons[ig.key] ?? Link2;
          const profile = user?.socialProfiles?.[ig.key];
          const connected = Boolean(profile?.connected);
          return (
            <GlassCard key={ig.key} hover className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl glass flex items-center justify-center">
                  <Icon className="w-5 h-5 text-ink-text" />
                </div>
                {connected ? (
                  <Badge tone="emerald">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge tone="neutral">Not Connected</Badge>
                )}
              </div>

              <h3 className="text-sm font-semibold text-ink-text mb-1">
                {ig.platform}
              </h3>
              <p className="text-xs text-slate-500 mb-4 flex-1">
                {connected
                  ? "Auto-post your rendered videos directly to this platform."
                  : "Connect to enable automatic publishing of your verse videos."}
              </p>

              {connected && profile?.handle && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-overlay/[0.03] border border-ink-overlay/[0.05] mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-text truncate">
                      {profile.handle}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-mint shadow-glow" />
                </div>
              )}

              <Button
                size="sm"
                onClick={() => connect(ig.key)}
                disabled={connected}
              >
                <Link2 className="w-3.5 h-3.5" />
                {connected ? "Connected" : "Connect Account"}
              </Button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
