// src/routes/ProtectedRoute.jsx
// Guards routes that require authentication.
//
// Behavior:
//   • status === "initializing" → show loading spinner (session restore in progress)
//   • status === "unauthenticated" → redirect to /login, preserving the
//     original URL in location state so Login can redirect back after success
//   • status === "authenticated" → render child routes via <Outlet>

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Small inline spinner — avoids importing a heavy component just for a guard.
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

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Wait for session restoration to complete before making any routing decision.
  if (status === 'initializing') {
    return <AuthLoadingFallback />;
  }

  // Not authenticated → send to login, remember where the user was trying to go.
  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render the nested route.
  return <Outlet />;
}
