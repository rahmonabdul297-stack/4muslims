import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  User as UserIcon,
  Mail,
  Lock,
  Camera,
  Loader2,
  Pencil,
  X,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Youtube,
  Music2,
  Facebook,
  Calendar,
  Video as VideoIcon,
} from "lucide-react";
import {
  GlassCard,
  Button,
  Field,
  Input,
  Badge,
  PlanPill,
} from "@/components/ui";
import { useApp } from "@/store";
import { useToast } from "@/toast";
import { ApiError } from "@/lib/apiClient";
import { getProfile, updateProfile } from "@/lib/profileApi";
import type { AutoPostPlatform, User } from "@/types";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink-overlay/[0.06] last:border-0 gap-4">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-ink-text text-right truncate">
        {value}
      </span>
    </div>
  );
}

const platformIcons: Record<AutoPostPlatform, typeof Youtube> = {
  youtube: Youtube,
  tiktok: Music2,
  facebook: Facebook,
};

export function ProfilePage() {
  const { refreshUser } = useApp();
  const { push } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProfile = () =>
    getProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setPreview(data.profileImage ?? "");
    });

  useEffect(() => {
    let cancelled = false;
    loadProfile()
      .catch((err) => {
        if (!cancelled) {
          push(
            err instanceof ApiError
              ? err.message
              : "Unable to load your profile.",
            "error",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageChange = (file: File | null) => {
    setImage(file);
    setPreview(
      file ? URL.createObjectURL(file) : (profile?.profileImage ?? ""),
    );
  };

  const cancelEdit = () => {
    setEditing(false);
    setPassword("");
    setImage(null);
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPreview(profile.profileImage ?? "");
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: name !== profile?.name ? name : undefined,
        email: email !== profile?.email ? email : undefined,
        password: password || undefined,
        image: image ?? undefined,
      });
      await Promise.all([refreshUser(), loadProfile()]);
      setPassword("");
      setImage(null);
      setEditing(false);
      push("Profile updated successfully!", "success");
    } catch (err) {
      push(
        err instanceof ApiError
          ? err.message
          : "Unable to update your profile.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading your profile...
      </div>
    );
  }

  if (!profile) return null;

  const usage = profile.monthlyUsage;
  const autoPost = profile.autoPostSettings;
  const socialEntries = profile.socialProfiles
    ? (Object.entries(profile.socialProfiles) as [
        AutoPostPlatform,
        { connected?: boolean; handle?: string } | undefined,
      ][])
    : [];
    // const [coverBg, setcoverBg] =useState("")
  return (
    <div className="max-w-full">
      {/* Header / account details */}
      <div className={`relative bg-[url('/images/cover-bg.png')] bg-cover bg-center h-[250px] mb-12`}>
            <div className="absolute top-3/4 left-10 w-[100px] h-[100px] rounded-[50%] bg-gradient-to-br from-emerald-deep to-emerald-mint flex items-center justify-center overflow-hidden shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover "
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {(name || "A").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
          </div>
      <GlassCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <label
              className={`relative ${editing ? "cursor-pointer group" : ""}`}
            >
              
              {editing && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
                  />
                </>
              )}
            </label>
            <div>
              <p className="text-base font-semibold text-ink-text">
                {profile.name}
              </p>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <PlanPill plan={profile.plan} />
                {profile.isVerified ? (
                  <Badge tone="emerald">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge tone="amber">
                    <ShieldAlert className="w-3 h-3" />
                    Unverified
                  </Badge>
                )}
                {profile.role === "admin" && <Badge tone="gold">Admin</Badge>}
              </div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="w-9 h-9 shrink-0 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-emerald-mint transition"
              aria-label="Edit profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={submit} className="space-y-4 mt-6">
            <Field label="Full Name">
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>

            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>

            <Field
              label="New Password"
              hint="Leave blank to keep your current password"
            >
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={cancelEdit}
                disabled={saving}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <InfoRow label="Full Name" value={profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phone} />
            <InfoRow
              label="Sign-in Method"
              value={<span className="capitalize">{profile.authProvider}</span>}
            />
          </div>
        )}
      </GlassCard>

      {/* Subscription */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-ink-text mb-1">
          Subscription
        </h3>
        <div className="mt-2">
          <InfoRow label="Plan" value={<PlanPill plan={profile.plan} />} />
          <InfoRow
            label="Status"
            value={
              <span className="capitalize">{profile.subscriptionStatus}</span>
            }
          />
          <InfoRow
            label="Premium Expires"
            value={
              profile.premiumExpiresAt
                ? new Date(profile.premiumExpiresAt).toLocaleDateString()
                : "N/A"
            }
          />
        </div>
      </GlassCard>

      {/* Usage */}
      {usage && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-ink-text mb-3 flex items-center gap-2">
            <VideoIcon className="w-4 h-4 text-emerald-mint" /> Usage This Month
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-ink-overlay/[0.03] p-3 text-center">
              <p className="text-lg font-bold text-ink-text">
                {usage.videosGenerated}
              </p>
              <p className="text-[10px] text-slate-500 uppercase">
                Total Videos
              </p>
            </div>
            <div className="rounded-lg bg-ink-overlay/[0.03] p-3 text-center">
              <p className="text-lg font-bold text-ink-text">
                {usage.manualGenerationsCount}
              </p>
              <p className="text-[10px] text-slate-500 uppercase">
                Manual Renders
              </p>
            </div>
            <div className="rounded-lg bg-ink-overlay/[0.03] p-3 text-center">
              <p className="text-lg font-bold text-ink-text">
                {usage.autoGenerationsCount}
              </p>
              <p className="text-[10px] text-slate-500 uppercase">
                Auto Renders
              </p>
            </div>
          </div>
          {usage.lastResetDate && (
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-500">
              <Calendar className="w-3 h-3" /> Resets on{" "}
              {new Date(usage.lastResetDate).toLocaleDateString()}
            </div>
          )}
        </GlassCard>
      )}

      {/* Auto-Post */}
      {autoPost && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-ink-text mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-mint" /> Auto-Post Settings
          </h3>
          <div className="mt-2">
            <InfoRow
              label="Enabled"
              value={
                autoPost.enabled ? (
                  <Badge tone="emerald">On</Badge>
                ) : (
                  <Badge tone="neutral">Off</Badge>
                )
              }
            />
            <InfoRow
              label="Platform"
              value={
                <span className="capitalize">{autoPost.selectedPlatform}</span>
              }
            />
            <InfoRow label="Frequency" value={autoPost.postFrequency} />
            <InfoRow
              label="Posts This Month"
              value={autoPost.monthlyAutoPostCount}
            />
            {autoPost.lastAutoPostDate && (
              <InfoRow
                label="Last Post"
                value={new Date(autoPost.lastAutoPostDate).toLocaleDateString()}
              />
            )}
          </div>
        </GlassCard>
      )}

      {/* Connected accounts */}
      {socialEntries.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-ink-text mb-3">
            Connected Accounts
          </h3>
          <div className="space-y-2">
            {socialEntries.map(([key, val]) => {
              const Icon = platformIcons[key] ?? UserIcon;
              const connected = Boolean(val?.connected);
              return (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-overlay/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-ink-text capitalize">
                      {key}
                    </span>
                  </div>
                  {connected ? (
                    <Badge tone="emerald">{val?.handle ?? "Connected"}</Badge>
                  ) : (
                    <Badge tone="neutral">Not Connected</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
