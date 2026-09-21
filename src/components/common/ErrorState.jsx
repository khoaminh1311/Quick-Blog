import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'An error occurred', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/30">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      {message && <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </div>
  );
}
