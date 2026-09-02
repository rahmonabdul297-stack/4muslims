import type {
  Integration,
  Reciter,
  UserState,
  VideoRecord,
  VideoTemplate,
} from './types';

export const currentUser: UserState = {
  name: 'Adebayo Ibrahim',
  email: 'adebayo@4muslims.app',
  plan: 'FREE',
  avatar: 'AI',
  rendersUsed: 2,
  rendersLimit: 3,
};

export const surahs: { number: number; name: string; arabic: string; ayahs: number }[] = [
  { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', ayahs: 7 },
  { number: 2, name: 'Al-Baqarah', arabic: 'البقرة', ayahs: 286 },
  { number: 3, name: 'Ali Imran', arabic: 'آل عمران', ayahs: 200 },
  { number: 36, name: 'Ya-Sin', arabic: 'يس', ayahs: 83 },
  { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', ayahs: 78 },
  { number: 67, name: 'Al-Mulk', arabic: 'الملك', ayahs: 30 },
  { number: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', ayahs: 4 },
  { number: 113, name: 'Al-Falaq', arabic: 'الفلق', ayahs: 5 },
  { number: 114, name: 'An-Nas', arabic: 'الناس', ayahs: 6 },
];

export const reciters: Reciter[] = [
  { id: 'afasy', name: 'Mishary Alafasy', arabicName: 'مشاري العفاسي', style: 'Modern · Melodic' },
  { id: 'basit', name: 'Abdul Basit', arabicName: 'عبد الباسط', style: 'Classic · Murattal' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', arabicName: 'عبد الرحمن السديس', style: 'Soulful · Nasheed' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', arabicName: 'سعود الشريم', style: 'Traditional' },
  { id: 'husary', name: 'Mahmoud Al-Husary', arabicName: 'محمود الحصري', style: 'Tartil · Slow' },
];

export const templates: VideoTemplate[] = [
  { id: 'emerald-glow', name: 'Emerald Glow', motion: 'Subtle Zoom', gradient: 'from-emerald-deep to-emerald-mint', pattern: 'arabesque' },
  { id: 'golden-dusk', name: 'Golden Dusk', motion: 'Pan & Fade', gradient: 'from-gold to-gold-light', pattern: 'calligraphic' },
  { id: 'night-sky', name: 'Night Sky', motion: 'Particle Drift', gradient: 'from-slate-800 to-indigo-900', pattern: 'geometric' },
  { id: 'desert-min', name: 'Desert Minimal', motion: 'Static Text', gradient: 'from-amber-700 to-amber-900', pattern: 'minimal' },
  { id: 'ocean-calm', name: 'Ocean Calm', motion: 'Wave Pulse', gradient: 'from-cyan-800 to-teal-900', pattern: 'geometric' },
  { id: 'royal-green', name: 'Royal Green', motion: 'Slow Zoom', gradient: 'from-green-700 to-emerald-deep', pattern: 'arabesque' },
];

export const sampleVideos: VideoRecord[] = [
  {
    id: 'v1',
    surah: 1,
    surahName: 'Al-Fatihah',
    ayah: 1,
    reciter: 'Mishary Alafasy',
    template: 'Emerald Glow',
    duration: 18,
    status: 'Completed',
    createdAt: '2026-08-28T10:30:00Z',
    thumbnail: 'from-emerald-deep to-emerald-mint',
  },
  {
    id: 'v2',
    surah: 36,
    surahName: 'Ya-Sin',
    ayah: 82,
    reciter: 'Abdul Basit',
    template: 'Golden Dusk',
    duration: 24,
    status: 'Processing',
    createdAt: '2026-08-30T14:12:00Z',
    thumbnail: 'from-gold to-gold-light',
  },
  {
    id: 'v3',
    surah: 112,
    surahName: 'Al-Ikhlas',
    ayah: 1,
    reciter: 'Mahmoud Al-Husary',
    template: 'Night Sky',
    duration: 15,
    status: 'Completed',
    createdAt: '2026-08-25T08:00:00Z',
    thumbnail: 'from-slate-800 to-indigo-900',
  },
  {
    id: 'v4',
    surah: 55,
    surahName: 'Ar-Rahman',
    ayah: 13,
    reciter: 'Abdur-Rahman As-Sudais',
    template: 'Ocean Calm',
    duration: 21,
    status: 'Failed',
    createdAt: '2026-08-29T19:45:00Z',
    thumbnail: 'from-cyan-800 to-teal-900',
  },
  {
    id: 'v5',
    surah: 67,
    surahName: 'Al-Mulk',
    ayah: 1,
    reciter: 'Mishary Alafasy',
    template: 'Royal Green',
    duration: 19,
    status: 'Completed',
    createdAt: '2026-08-20T11:20:00Z',
    thumbnail: 'from-green-700 to-emerald-deep',
  },
  {
    id: 'v6',
    surah: 2,
    surahName: 'Al-Baqarah',
    ayah: 255,
    reciter: 'Saud Al-Shuraim',
    template: 'Desert Minimal',
    duration: 30,
    status: 'Completed',
    createdAt: '2026-08-15T16:05:00Z',
    thumbnail: 'from-amber-700 to-amber-900',
  },
];

export const integrations: Integration[] = [
  { id: 'yt', platform: 'YouTube Shorts', connected: true, handle: '@4muslims.official', followers: '12.4K' },
  { id: 'tt', platform: 'TikTok', connected: false },
  { id: 'fb', platform: 'Facebook Pages', connected: true, handle: '4Muslims Daily', followers: '3.1K' },
];

export const pricingPlans = [
  {
    id: 'FREE' as const,
    name: 'Free',
    priceNGN: 0,
    tagline: 'Get started with AI verse videos',
    features: [
      '3 renders per month',
      'Up to 15s video duration',
      '480p resolution',
      'Watermark on videos',
      '5 reciter voices',
      'Manual downloads',
    ],
    limits: { renders: 3, duration: 15, resolution: '480p', watermark: true },
    highlight: false,
  },
  {
    id: 'PRO' as const,
    name: 'Pro',
    priceNGN: 5000,
    tagline: 'For creators & small da\'wah channels',
    features: [
      '50 renders per month',
      'Up to 60s video duration',
      '1080p HD resolution',
      'No watermark',
      'All reciter voices',
      'Daily Auto-Post (1 platform)',
      'Priority queue',
    ],
    limits: { renders: 50, duration: 60, resolution: '1080p', watermark: false },
    highlight: true,
  },
  {
    id: 'ULTIMATE' as const,
    name: 'Ultimate',
    priceNGN: 12000,
    tagline: 'Scale your da\'wah content engine',
    features: [
      'Unlimited renders',
      'Up to 180s video duration',
      '4K Ultra HD resolution',
      'No watermark',
      'All reciter voices + custom',
      'Daily Auto-Post (3 platforms)',
      'Priority queue + custom branding',
    ],
    limits: { renders: Infinity, duration: 180, resolution: '4K', watermark: false },
    highlight: false,
  },
];

export const durationOptions = [1, 3, 6, 12];
