import type { AyahData, QuranReciter, SurahMeta } from "@/types";

const BASE = "https://api.alquran.cloud/v1";
const TRANSLATION_EDITION = "en.sahih";

export const quranReciters: QuranReciter[] = [
  {
    id: "afasy",
    name: "Mishary Alafasy",
    arabicName: "مشاري العفاسي",
    edition: "ar.alafasy",
  },
  {
    id: "basit",
    name: "Abdul Basit",
    arabicName: "عبد الباسط",
    edition: "ar.abdulbasitmurattal",
  },
  {
    id: "sudais",
    name: "Abdur-Rahman As-Sudais",
    arabicName: "عبد الرحمن السديس",
    edition: "ar.abdurrahmaansudais",
  },
  {
    id: "husary",
    name: "Mahmoud Al-Husary",
    arabicName: "محمود الحصري",
    edition: "ar.husary",
  },
  {
    id: "hudhaify",
    name: "Ali Al-Hudhaify",
    arabicName: "علي الحذيفي",
    edition: "ar.hudhaify",
  },
];

export function audioUrl(globalAyahNumber: number, editionId: string) {
  return `https://cdn.islamic.network/quran/audio/128/${editionId}/${globalAyahNumber}.mp3`;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status ?? "Request failed");
  return json.data as T;
}

export async function fetchAllSurahs(): Promise<SurahMeta[]> {
  return getJson<SurahMeta[]>(`${BASE}/surah`);
}

export async function fetchSurahMeta(surahNumber: number): Promise<SurahMeta> {
  const data = await getJson<{
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  }>(`${BASE}/surah/${surahNumber}`);
  return data as SurahMeta;
}

interface RawAyah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  surah?: { number: number; englishName: string };
}

export async function fetchSurahAyahs(
  surahNumber: number,
): Promise<AyahData[]> {
  const [arabic, translation] = await Promise.all([
    getJson<{ ayahs: RawAyah[]; englishName: string }>(
      `${BASE}/surah/${surahNumber}/quran-uthmani`,
    ),
    getJson<{ ayahs: RawAyah[] }>(
      `${BASE}/surah/${surahNumber}/${TRANSLATION_EDITION}`,
    ),
  ]);
  return arabic.ayahs.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    translation: translation.ayahs[i]?.text ?? "",
    surah: surahNumber,
    surahName: arabic.englishName,
    juz: a.juz,
  }));
}

export async function fetchJuzAyahs(juzNumber: number): Promise<AyahData[]> {
  const [arabic, translation] = await Promise.all([
    getJson<{ ayahs: RawAyah[] }>(`${BASE}/juz/${juzNumber}/quran-uthmani`),
    getJson<{ ayahs: RawAyah[] }>(
      `${BASE}/juz/${juzNumber}/${TRANSLATION_EDITION}`,
    ),
  ]);
  return arabic.ayahs.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    translation: translation.ayahs[i]?.text ?? "",
    surah: a.surah?.number ?? 0,
    surahName: a.surah?.englishName ?? "",
    juz: juzNumber,
  }));
}
