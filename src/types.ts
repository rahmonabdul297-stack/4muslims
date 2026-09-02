export type Plan = "FREE" | "PRO" | "ULTIMATE";

export type RenderStatus = "Completed" | "Processing" | "Failed" | "Pending";

export interface VideoRecord {
  id: string;
  surah: number;
  surahName: string;
  ayah: number;
  reciter: string;
  template: string;
  duration: number;
  status: RenderStatus;
  createdAt: string;
  thumbnail: string;
}

export interface UserState {
  name: string;
  email: string;
  plan: Plan;
  avatar: string;
  rendersUsed: number;
  rendersLimit: number;
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  motion: string;
  gradient: string;
  pattern: "arabesque" | "geometric" | "minimal" | "calligraphic";
}

export interface Integration {
  id: string;
  platform: string;
  connected: boolean;
  handle?: string;
  followers?: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AyahData {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  surah: number;
  surahName: string;
  juz: number;
}

export interface QuranReciter {
  id: string;
  name: string;
  arabicName: string;
  edition: string;
}

export interface FavoriteAyah {
  id: string;
  surah: number;
  surahName: string;
  ayah: number;
  text: string;
  translation: string;
  addedAt: string;
}

export interface RecentAyah {
  id: string;
  surah: number;
  surahName: string;
  ayah: number;
  visitedAt: string;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DuaCategory {
  slug: string;
  name: string;
}

export interface DuaItem {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}
