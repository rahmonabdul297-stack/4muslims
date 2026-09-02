import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastCtx {
  toasts: Toast[];
  push: (message: string, type?: Toast['type']) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return <Ctx.Provider value={{ toasts, push, dismiss }}>{children}</Ctx.Provider>;
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
