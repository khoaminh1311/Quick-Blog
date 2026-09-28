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
import ThemeToggle from './ThemeToggle';
import { User, LogOut, Plus, ClipboardList, Users, SquarePen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logoImg from '../quick-blog-logo.png';

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
    <header className="relative z-30 border-b border-transparent bg-white/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:h-24 sm:px-6">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center"
          aria-label="QuickBlog home"
        >
          <img
            alt="QuickBlog"
            className="h-10 w-auto sm:h-12"
            src={logoImg}
          />
        </Link>

        {/* ── Right-side controls ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-5">

          {/* Create Blog button */}
          <NavLink
            to="/posts/new"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-8 rounded-md px-3 text-xs font-bold sm:h-9 sm:text-sm"
            title="Create Blog"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blog</span>
          </NavLink>

          <ThemeToggle />

          {/* ── User Dropdown ─────────────────────────────────────────── */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 h-9 w-9 rounded-lg sm:h-11 sm:w-[3.25rem]"
              aria-label="Open user menu"
              type="button"
              id="user-menu-button"
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              <User className="h-5 w-5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 z-50 min-w-[12.5rem] w-52 rounded-lg border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/posts/new"
                      className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 sm:hidden whitespace-nowrap"
                      onClick={closeDropdown}
                    >
                      <SquarePen className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>Create Blog</span>
                    </Link>

                    <Link
                      to="/my-posts"
                      className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                      onClick={closeDropdown}
                    >
                      <ClipboardList className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>My Posts</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                        onClick={closeDropdown}
                      >
                        <Users className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                        <span>User Management</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 text-left whitespace-nowrap"
                      id="logout-button"
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/posts/new"
                      className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 sm:hidden whitespace-nowrap"
                      onClick={closeDropdown}
                    >
                      <SquarePen className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>Create Blog</span>
                    </Link>

                    <Link
                      to="/my-posts"
                      className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                      onClick={closeDropdown}
                    >
                      <ClipboardList className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>My Posts</span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-normal text-slate-950 outline-none transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                      onClick={closeDropdown}
                    >
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
