

export default function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isAdmin
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
      }`}
    >
      {role}
    </span>
  );
}

