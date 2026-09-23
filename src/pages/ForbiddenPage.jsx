// src/pages/ForbiddenPage.jsx
// Shown when an authenticated user tries to access a page
// they do not have permission for (e.g. a regular user opening /admin/users).
// Does not expose technical role details or API errors.

import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
            <ShieldOff className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-200 dark:text-slate-700 mb-2 select-none">
          403
        </h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Access Denied
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          You don&apos;t have permission to view this page.
          If you think this is a mistake, please contact the site administrator.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
