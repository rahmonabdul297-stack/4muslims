import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
} from "lucide-react";
import { audioUrl, quranReciters } from "@/lib/quranApi";
import { getCachedAudioUrl } from "@/lib/audioCache";
import { Select } from "./ui";
import type { AyahData } from "@/types";

interface AudioPlayerBarProps {
  ayahs: AyahData[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export function AudioPlayerBar({
  ayahs,
  currentIndex,
  onIndexChange,
  reciterId,
  onReciterChange,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);

  const ayah = ayahs[currentIndex];
  const reciter =
    quranReciters.find((r) => r.id === reciterId) ?? quranReciters[0];

  useEffect(() => {
    if (!ayah) return;
    let cancelled = false;
    setProgress(0);
    const load = async () => {
      const url = audioUrl(ayah.number, reciter.edition);
      const resolved = await getCachedAudioUrl(url);
      if (cancelled || !audioRef.current) return;
      audioRef.current.src = resolved;
      if (playing) audioRef.current.play().catch(() => setPlaying(false));
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayah?.number, reciter.edition]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleEnded = () => {
    if (repeat) {
      audioRef.current?.play().catch(() => {});
      return;
    }
    if (currentIndex < ayahs.length - 1) {
      onIndexChange(currentIndex + 1);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100,
    );
  };

  if (!ayah) return null;

  return (
    <div className="sticky bottom-4 z-20 glass-strong rounded-2xl p-4 flex flex-col gap-3">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="h-1 rounded-full bg-ink-overlay/[0.08] overflow-hidden">
        <div
          className="h-full bg-emerald-mint transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg text-slate-300 hover:text-ink-text hover:bg-ink-overlay/[0.06] disabled:opacity-30 transition"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-xl bg-emerald-mint text-white flex items-center justify-center hover:bg-emerald-mint/90 shadow-glow transition"
        >
          {playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        <button
          onClick={() =>
            onIndexChange(Math.min(ayahs.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === ayahs.length - 1}
          className="p-2 rounded-lg text-slate-300 hover:text-ink-text hover:bg-ink-overlay/[0.06] disabled:opacity-30 transition"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <button
          onClick={() => setRepeat((r) => !r)}
          className={`p-2 rounded-lg transition ${repeat ? "text-emerald-400 bg-emerald-mint/10" : "text-slate-400 hover:text-ink-text hover:bg-ink-overlay/[0.06]"}`}
          title="Repeat ayah"
        >
          <Repeat className="w-4 h-4" />
        </button>
        <div className="text-xs text-slate-400 min-w-0 truncate flex-1">
          Ayah {ayah.numberInSurah} &middot; {reciter.name}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-48">
          <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
          <Select
            value={reciterId}
            onChange={(e) => onReciterChange(e.target.value)}
            className="!py-1.5 !text-xs"
          >
            {quranReciters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
