import { NavLink, Link } from 'react-router-dom';
import Container from '../common/Container';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
      : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <span>Mini Blog</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/my-posts" className={navLinkClass}>
              My Posts
            </NavLink>
            <NavLink to="/posts/new" className={navLinkClass}>
              Create Post
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Admin Users
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
