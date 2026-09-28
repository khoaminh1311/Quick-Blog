import { useEffect } from 'react';

import { X, Check } from 'lucide-react';

export default function Toast({ message, onClose, duration = 4000, type = 'error' }) {
  useEffect(() => {
    if (!message || duration <= 0) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      onClick={onClose}
      className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-slate-100 bg-white px-4 py-2.5 shadow-lg transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 cursor-pointer select-none"
    >
      {type === 'error' ? (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-white">
          <X className="h-3 w-3 stroke-[3]" />
        </div>
      ) : type === 'success' ? (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3 w-3 stroke-[3]" />
        </div>
      ) : null}
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {message}
      </span>
    </div>
  );
}

