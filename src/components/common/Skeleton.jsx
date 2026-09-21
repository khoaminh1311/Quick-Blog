export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${variants[variant]} ${className}`}
    />
  );
}
