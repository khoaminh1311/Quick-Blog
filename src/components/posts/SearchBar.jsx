import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search for blogs' }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-20 sm:pr-28 py-3.5 border border-slate-200 dark:border-slate-800 rounded-full leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-base shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-y-0 right-1.5 flex items-center">
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
          onClick={() => {}}
        >
          Search
        </button>
      </div>
    </div>
  );
}
