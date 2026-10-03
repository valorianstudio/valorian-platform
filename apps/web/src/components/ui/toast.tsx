'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  /** 0-100 for a determinate progress bar; undefined shows an indeterminate spinner only. */
  progress?: number;
}

const DURATION: Record<ToastKind, number> = { success: 4000, info: 5000, warning: 6500, error: 7000, loading: 0 };

const STYLES: Record<ToastKind, { icon: typeof Info; tone: string; bar: string }> = {
  success: { icon: CheckCircle2, tone: 'text-emerald-600', bar: 'bg-emerald-500' },
  error: { icon: XCircle, tone: 'text-danger', bar: 'bg-danger' },
  warning: { icon: AlertTriangle, tone: 'text-amber-600', bar: 'bg-amber-500' },
  info: { icon: Info, tone: 'text-primary', bar: 'bg-primary' },
  loading: { icon: Loader2, tone: 'text-primary', bar: 'bg-primary' },
};

/** Handle returned by `toast.loading()`: keep it to report progress and the final outcome in the same notification. */
export interface LoadingToast {
  update: (message: string, progress?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: () => void;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  loading: (message: string, progress?: number) => LoadingToast;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, number>());
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const schedule = useCallback(
    (id: number, kind: ToastKind) => {
      const existing = timers.current.get(id);
      if (existing) window.clearTimeout(existing);
      if (DURATION[kind] > 0) timers.current.set(id, window.setTimeout(() => dismiss(id), DURATION[kind]));
    },
    [dismiss],
  );

  const show = useCallback(
    (kind: ToastKind, message: string, progress?: number): number => {
      counter.current += 1;
      const id = counter.current;
      // Keep the stack short on small screens; the oldest notification makes room.
      setItems((current) => [...current.slice(-3), { id, kind, message, progress }]);
      schedule(id, kind);
      return id;
    },
    [schedule],
  );

  const change = useCallback(
    (id: number, patch: Partial<Omit<ToastItem, 'id'>>) => {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      if (patch.kind) schedule(id, patch.kind);
    },
    [schedule],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => void show('success', message),
      error: (message) => void show('error', message),
      warning: (message) => void show('warning', message),
      info: (message) => void show('info', message),
      loading: (message, progress) => {
        const id = show('loading', message, progress);
        return {
          update: (next, percent) => change(id, { message: next, progress: percent }),
          success: (next) => change(id, { kind: 'success', message: next, progress: undefined }),
          error: (next) => change(id, { kind: 'error', message: next, progress: undefined }),
          dismiss: () => dismiss(id),
        };
      },
    }),
    [show, change, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:px-6">
        {items.map((item) => {
          const { icon: Icon, tone, bar } = STYLES[item.kind];
          return (
            <div
              key={item.id}
              role={item.kind === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto w-full max-w-sm animate-fade-up overflow-hidden rounded-xl border border-border bg-background text-sm shadow-lg"
            >
              <div className="flex items-start gap-3 p-4">
                <Icon className={cn('mt-0.5 size-4 shrink-0', tone, item.kind === 'loading' && 'animate-spin')} aria-hidden />
                <p className="min-w-0 flex-1 break-words">{item.message}</p>
                {item.progress !== undefined && <span className="shrink-0 text-xs font-medium tabular-nums text-muted">{Math.round(item.progress)}%</span>}
                {item.kind !== 'loading' && (
                  <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification" className="-m-1 grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-strong">
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              {item.progress !== undefined && (
                <div className="h-1 bg-surface-strong" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(item.progress)}>
                  <div className={cn('h-full transition-[width] duration-200', bar)} style={{ width: `${Math.max(2, Math.min(100, item.progress))}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used within ToastProvider');
  return api;
}
