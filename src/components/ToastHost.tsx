import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/toast';

export function ToastHost() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;
        const tone =
          t.type === 'success'
            ? 'border-emerald-mint/30 text-emerald-400'
            : t.type === 'error'
            ? 'border-red-500/30 text-red-400'
            : 'border-ink-overlay/10 text-slate-300';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto glass-strong rounded-xl p-3.5 flex items-start gap-3 animate-fade-in border-l-2 ${tone}`}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm text-ink-text flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-ink-text">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
