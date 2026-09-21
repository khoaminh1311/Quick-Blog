import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title = 'No data found', message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 border-dashed">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      {message && <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">{message}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
