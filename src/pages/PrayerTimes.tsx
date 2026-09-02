import { useEffect, useState } from "react";
import {
  MapPin,
  Loader2,
  AlertCircle,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
} from "lucide-react";
import {
  GlassCard,
  Input,
  Button,
  Field,
  EmptyState,
  Badge,
} from "@/components/ui";
import {
  fetchPrayerTimesByAddress,
  fetchPrayerTimesByCoords,
  getNextPrayer,
  formatCountdown,
  type PrayerResult,
} from "@/lib/prayerApi";
import type { PrayerTimings } from "@/types";

const prayerIcons: Record<keyof PrayerTimings, typeof Sun> = {
  Fajr: CloudSun,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export function PrayerTimesPage() {
  const [result, setResult] = useState<PrayerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [now, setNow] = useState(new Date());

  const locate = () => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported. Enter a location manually below.",
      );
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchPrayerTimesByCoords(pos.coords.latitude, pos.coords.longitude)
          .then(setResult)
          .catch(() =>
            setError("Unable to fetch prayer times for your location."),
          )
          .finally(() => setLoading(false));
      },
      () => {
        setError(
          "Location permission denied. Enter a location manually below.",
        );
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    locate();
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    fetchPrayerTimesByAddress(address.trim())
      .then(setResult)
      .catch(() => setError("Unable to find prayer times for that location."))
      .finally(() => setLoading(false));
  };

  const next = result ? getNextPrayer(result.timings, now) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Badge tone="emerald">Free for everyone</Badge>
        <span className="text-xs text-slate-500">
          Prayer times require location access or a manual address
        </span>
      </div>

      <form
        onSubmit={submitAddress}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex-1">
          <Field label="Manual location" hint="e.g. Lagos, Nigeria">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, Country"
            />
          </Field>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" variant="secondary">
            Search
          </Button>
          <Button type="button" onClick={locate}>
            <MapPin className="w-4 h-4" /> Use my location
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Fetching prayer times...
        </div>
      ) : error && !result ? (
        <GlassCard className="py-8">
          <EmptyState
            icon={<AlertCircle className="w-7 h-7" />}
            title="Location needed"
            description={error}
          />
        </GlassCard>
      ) : result ? (
        <>
          <GlassCard className="p-6 mb-6 text-center">
            <p className="text-xs text-slate-500 mb-1">{result.location}</p>
            <p className="text-sm text-slate-400 mb-3">{result.date}</p>
            {next && (
              <>
                <p className="text-3xl font-bold text-ink-text">{next.name}</p>
                <p className="text-sm text-emerald-400 mt-1">
                  in {formatCountdown(next.minutesRemaining)} &middot;{" "}
                  {next.time}
                </p>
              </>
            )}
          </GlassCard>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(Object.keys(result.timings) as (keyof PrayerTimings)[]).map(
              (name) => {
                const Icon = prayerIcons[name];
                const active = next?.name === name;
                return (
                  <GlassCard
                    key={name}
                    className={`p-4 text-center ${active ? "border-emerald-mint/40 bg-ink-overlay/[0.05]" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 mx-auto mb-2 ${active ? "text-emerald-400" : "text-slate-400"}`}
                    />
                    <p className="text-sm font-semibold text-ink-text">{name}</p>
                    <p className="text-xs text-slate-500">
                      {result.timings[name]}
                    </p>
                  </GlassCard>
                );
              },
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
