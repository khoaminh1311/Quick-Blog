export default function SearchBar({ value, onChange, placeholder = 'Enter search title...' }) {
  return (
    <form 
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto mt-7 flex max-w-[17.5rem] overflow-hidden rounded-sm border border-slate-300 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:max-w-2xl sm:rounded-md"
    >
      <input
        type="text"
        className="w-full rounded-md border-slate-200 bg-white text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950 h-9 min-w-0 border-0 px-3 text-base shadow-none focus:border-0 focus:ring-0 sm:h-12 sm:px-4 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button 
        type="submit"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-8 min-w-[4.25rem] shrink-0 rounded-sm px-3 text-[10px] sm:h-12 sm:min-w-[8rem] sm:rounded-md sm:text-base"
      >
        Search
      </button>
    </form>
  );
}

