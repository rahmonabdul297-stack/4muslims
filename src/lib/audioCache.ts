const CACHE_NAME = "quran-audio-v1";

export async function getCachedAudioUrl(url: string): Promise<string> {
  if (!("caches" in window)) return url;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    if (match) {
      const blob = await match.blob();
      return URL.createObjectURL(blob);
    }
    const res = await fetch(url);
    if (res.ok) {
      await cache.put(url, res.clone());
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  } catch {
    // fall through to network URL if caching fails
  }
  return url;
}
