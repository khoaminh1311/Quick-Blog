// src/routes/RoleRoute.jsx
// Guards routes that require both authentication AND a specific role.
//
// Props:
//   allowedRoles — array of allowed role strings, e.g. ["admin"]
//
// Behavior:
//   • Initializing → loading spinner (same as ProtectedRoute)
//   • Unauthenticated → /login (preserve original location for redirect-back)
//   • Authenticated, wrong role → /forbidden
//   • Authenticated, role matches → render child routes via <Outlet>

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

/**
 * @param {{ allowedRoles: string[] }} props
 */
export default function RoleRoute({ allowedRoles }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'initializing') {
    return <AuthLoadingFallback />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but role not in the allowed list → Forbidden.
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
