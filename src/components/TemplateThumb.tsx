import { GlassCard, Badge } from './ui';
import type { VideoTemplate } from '@/types';
import { Arabesque, Geometric, Minimal, Calligraphic } from './Patterns';

const patterns: Record<VideoTemplate['pattern'], typeof Arabesque> = {
  arabesque: Arabesque,
  geometric: Geometric,
  minimal: Minimal,
  calligraphic: Calligraphic,
};

export function TemplateThumbnail({
  template,
  surahArabic = 'بسم الله',
  className = '',
}: {
  template: VideoTemplate;
  surahArabic?: string;
  className?: string;
}) {
  const Pattern = patterns[template.pattern];
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${template.gradient} ${className}`}
    >
      <Pattern className="absolute inset-0 w-full h-full opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <p className="font-arabic text-2xl text-white/90 leading-snug drop-shadow-lg">{surahArabic}</p>
        <div className="mt-3 w-8 h-px bg-white/40" />
        <p className="mt-2 text-[10px] uppercase tracking-widest text-white/70">9:16</p>
      </div>
    </div>
  );
}

export function VideoCardThumb({
  gradient,
  arabicText = 'بسم الله',
  status,
  className = '',
}: {
  gradient: string;
  arabicText?: string;
  status?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} aspect-[9/16] ${className}`}>
      <Geometric className="absolute inset-0 w-full h-full opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
        <p className="font-arabic text-xl text-white/90 drop-shadow-lg leading-snug">{arabicText}</p>
      </div>
      {status && (
        <div className="absolute top-2 right-2">
          <Badge tone={status === 'Completed' ? 'emerald' : status === 'Failed' ? 'red' : 'amber'}>
            {status}
          </Badge>
        </div>
      )}
    </div>
  );
}
