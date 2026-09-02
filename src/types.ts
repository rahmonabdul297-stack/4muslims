export type Plan = "FREE" | "PRO" | "ULTIMATE";

export type AuthProvider = "google" | "apple" | "email";
export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "expired";
export type PostFrequency = "5_PER_MONTH" | "DAILY";
export type VideoJobStatus = "pending" | "processing" | "completed" | "failed";
export type AutoPostPlatform = "youtube" | "tiktok" | "facebook";

export interface MonthlyUsage {
  videosGenerated: number;
  lastResetDate: string;
  manualGenerationsCount: number;
  autoGenerationsCount: number;
}

export interface AutoPostSettings {
  enabled: boolean;
  selectedPlatform: AutoPostPlatform;
  defaultReciterId?: string;
  postFrequency: PostFrequency;
  lastAutoPostDate?: string;
  monthlyAutoPostCount: number;
}

export interface SocialProfileLink {
  connected?: boolean;
  handle?: string;
  [key: string]: unknown;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  subscriptionStatus: SubscriptionStatus;
  plan: Plan;
  role?: "user" | "admin";
  isVerified: boolean;
  premiumExpiresAt?: string | null;
  monthlyUsage?: MonthlyUsage;
  socialProfiles?: {
    youtube?: SocialProfileLink;
    tiktok?: SocialProfileLink;
    facebook?: SocialProfileLink;
  };
  autoPostSettings?: AutoPostSettings;
}

export interface GeneratedVideo {
  _id: string;
  jobId: string;
  userId: string;
  templateId: string;
  surahNumber: number;
  ayahNumber: number;
  reciterId: string;
  arabicText: string;
  translationText: string;
  audioUrl: string;
  surahName?: string;
  status: VideoJobStatus;
  progress: number;
  outputUrl: string;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoStatusResponse {
  status: VideoJobStatus;
  progress: number;
  outputUrl: string;
  errorMessage: string;
}

export interface GenerateVideoPayload {
  templateId: string;
  surahNumber: number;
  ayahNumber: number;
  reciterId: string;
  arabicText?: string;
  translationText?: string;
  surahName?: string;
}

export interface GenerateVideoResult {
  jobId: string;
  renderId: string;
  status: VideoJobStatus;
  usage: { used: number; limit: number };
}

export interface CheckoutSummary {
  tier: Plan;
  durationMonths: number;
  monthlyRate: number;
  totalAmount: number;
  currency: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  reference: string;
  summary: CheckoutSummary;
}

export interface AutoPostSettingsData {
  planTier: Plan;
  settings: AutoPostSettings;
  rules: { allowedFrequency: string; [key: string]: unknown };
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
  key: AutoPostPlatform;
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
