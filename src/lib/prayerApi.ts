import type { PrayerTimings } from "@/types";

const BASE = "https://api.aladhan.com/v1";

export interface PrayerResult {
  timings: PrayerTimings;
  date: string;
  location: string;
}

export async function fetchPrayerTimesByCoords(
  lat: number,
  lon: number,
): Promise<PrayerResult> {
  const url = `${BASE}/timings?latitude=${lat}&longitude=${lon}&method=2`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status ?? "Request failed");
  return {
    timings: json.data.timings,
    date: json.data.date.readable,
    location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
  };
}

export async function fetchPrayerTimesByAddress(
  address: string,
): Promise<PrayerResult> {
  const url = `${BASE}/timingsByAddress?address=${encodeURIComponent(address)}&method=2`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status ?? "Request failed");
  return {
    timings: json.data.timings,
    date: json.data.date.readable,
    location: address,
  };
}

const PRAYER_ORDER: (keyof PrayerTimings)[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export function getNextPrayer(timings: PrayerTimings, now: Date = new Date()) {
  const todayMinutes = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_ORDER) {
    if (name === "Sunrise") continue;
    const [h, m] = timings[name].split(":").map(Number);
    const minutes = h * 60 + m;
    if (minutes > todayMinutes) {
      const diff = minutes - todayMinutes;
      return { name, time: timings[name], minutesRemaining: diff };
    }
  }
  const [h, m] = timings.Fajr.split(":").map(Number);
  const minutesUntilMidnight = 24 * 60 - todayMinutes;
  return {
    name: "Fajr" as const,
    time: timings.Fajr,
    minutesRemaining: minutesUntilMidnight + h * 60 + m,
  };
}

export function formatCountdown(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}
