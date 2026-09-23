// src/routes/GuestOnlyRoute.jsx
// Guards public-only routes (Login, Register).
// Prevents authenticated users from seeing the auth pages.
//
// Behavior:
//   • Initializing → loading spinner (avoid briefly flashing the form before redirecting)
//   • Authenticated → redirect to / (or to location.state.from if available)
//   • Unauthenticated → render child routes via <Outlet>

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center gap-3 text-indigo-600">
        <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading…</span>
      </div>
    </div>
  );
}

export default function GuestOnlyRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Do not render or redirect until we know whether the user is authenticated.
  if (status === 'initializing') {
    return <AuthLoadingFallback />;
  }

  // Already logged in → send home (or back to wherever they came from).
  if (status === 'authenticated') {
    const destination = location.state?.from?.pathname ?? '/';
    return <Navigate to={destination} replace />;
  }

  // Guest → show the login or register form.
  return <Outlet />;
}
