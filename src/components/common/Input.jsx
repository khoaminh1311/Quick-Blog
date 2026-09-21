import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 
          placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
          dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-500'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
