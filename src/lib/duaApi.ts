import type { DuaCategory, DuaItem } from "@/types";

const BASE = "https://dua-dhikr.vercel.app";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

export async function fetchDuaCategories(): Promise<DuaCategory[]> {
  const data = await getJson<{ slug: string; name: string }[]>(
    `${BASE}/categories`,
  );
  return data.map((c) => ({ slug: c.slug, name: c.name }));
}

export async function fetchDuasByCategory(slug: string): Promise<DuaItem[]> {
  const data = await getJson<
    {
      id: number;
      title: string;
      arabic: string;
      latin: string;
      translation: string;
      notes?: string;
      fawaid?: string;
      source?: string;
    }[]
  >(`${BASE}/categories/${slug}`);
  return data.map((d) => ({
    id: d.id,
    title: d.title,
    arabic: d.arabic,
    latin: d.latin,
    translation: d.translation,
    notes: d.notes,
    fawaid: d.fawaid,
    source: d.source,
  }));
}
