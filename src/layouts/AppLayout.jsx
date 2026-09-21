import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Mini Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
