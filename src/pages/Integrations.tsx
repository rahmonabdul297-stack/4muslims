import { Youtube, Facebook, Music2, CheckCircle2, Link2, Unlink } from 'lucide-react';
import { GlassCard, Badge, Button } from '@/components/ui';
import { integrations } from '@/data';
import { useToast } from '@/toast';

const platformIcons: Record<string, typeof Youtube> = {
  'YouTube Shorts': Youtube,
  TikTok: Music2,
  'Facebook Pages': Facebook,
};

export function IntegrationsPage() {
  const { push } = useToast();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((ig) => {
          const Icon = platformIcons[ig.platform] ?? Link2;
          return (
            <GlassCard key={ig.id} hover className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl glass flex items-center justify-center">
                  <Icon className="w-5 h-5 text-ink-text" />
                </div>
                {ig.connected ? (
                  <Badge tone="emerald">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge tone="neutral">Not Connected</Badge>
                )}
              </div>

              <h3 className="text-sm font-semibold text-ink-text mb-1">{ig.platform}</h3>
              <p className="text-xs text-slate-500 mb-4 flex-1">
                {ig.connected
                  ? 'Auto-post your rendered videos directly to this platform.'
                  : 'Connect to enable automatic publishing of your verse videos.'}
              </p>

              {ig.connected && ig.handle && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-overlay/[0.03] border border-ink-overlay/[0.05] mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-text truncate">{ig.handle}</p>
                    <p className="text-[10px] text-slate-500">{ig.followers} followers</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-mint shadow-glow" />
                </div>
              )}

              {ig.connected ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => push(`Disconnected ${ig.platform}`, 'info')}
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => push(`Connecting to ${ig.platform}...`, 'info')}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Connect Account
                </Button>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
