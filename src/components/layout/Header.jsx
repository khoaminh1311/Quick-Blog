// src/components/layout/Header.jsx
// Responsive app header with role-aware navigation.
//
// Guest (unauthenticated):
//   → Logo only, Login + Sign up in dropdown.
//   → No Create Blog, no My Posts.
//
// Authenticated user (role: "user"):
//   → Logo, Create Blog button, My Posts in dropdown, Logout.
//
// Authenticated admin (role: "admin"):
//   → All user items + Admin Users link in dropdown.

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Container from '../common/Container';
import ThemeToggle from './ThemeToggle';
import { User, LogOut, FileText, LogIn, UserPlus, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <header className="bg-transparent absolute top-0 left-0 right-0 z-50">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span>Quickblog</span>
            </Link>
          </div>

          {/* ── Right-side controls ───────────────────────────────────────── */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* Create Blog — only shown when authenticated */}
            {isAuthenticated && (
              <NavLink
                to="/posts/new"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
                title="Create blog"
              >
                <Plus className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline">Create blog</span>
              </NavLink>
            )}

            <ThemeToggle />

            {/* ── User Dropdown ─────────────────────────────────────────── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 px-3 h-10 min-w-[2.5rem]"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                id="user-menu-button"
              >
                <User className="w-5 h-5 flex-shrink-0" />
                {isAuthenticated && user?.username && (
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                    {user.username}
                  </span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {user?.username}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>

                      {/* My Posts */}
                      <Link
                        to="/my-posts"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        onClick={closeDropdown}
                      >
                        <FileText className="w-4 h-4" />
                        My Posts
                      </Link>

                      {/* Admin Users — visible to admin only */}
                      {isAdmin && (
                        <Link
                          to="/admin/users"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          onClick={closeDropdown}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Users
                        </Link>
                      )}

                      {/* Divider */}
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 text-left"
                        id="logout-button"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        onClick={closeDropdown}
                      >
                        <LogIn className="w-4 h-4" />
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        onClick={closeDropdown}
                      >
                        <UserPlus className="w-4 h-4" />
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
