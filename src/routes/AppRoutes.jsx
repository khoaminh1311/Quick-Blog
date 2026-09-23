// src/routes/AppRoutes.jsx
// Central route definition for the app.
//
// Route policy:
//   /login, /register    → GuestOnlyRoute  (redirect authenticated users to /)
//   /, /posts/*, /my-posts → ProtectedRoute → AppLayout  (any authenticated user)
//   /admin/users         → ProtectedRoute → RoleRoute(admin) → AppLayout
//   /forbidden, *        → Public (anyone)

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import GuestOnlyRoute from './GuestOnlyRoute';

// ── Lazy-loaded pages ──────────────────────────────────────────────────────
const HomePage        = lazy(() => import('../pages/posts/HomePage'));
const PostDetailPage  = lazy(() => import('../pages/posts/PostDetailPage'));
const CreatePostPage  = lazy(() => import('../pages/posts/CreatePostPage'));
const MyPostsPage     = lazy(() => import('../pages/posts/MyPostsPage'));
const UsersPage       = lazy(() => import('../pages/admin/UsersPage'));
const LoginPage       = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage    = lazy(() => import('../pages/auth/RegisterPage'));
const ForbiddenPage   = lazy(() => import('../pages/ForbiddenPage'));
const NotFoundPage    = lazy(() => import('../pages/NotFoundPage'));

// Suspense fallback shown while a lazy chunk is being fetched.
const PageLoadingFallback = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="flex items-center gap-3 text-indigo-600">
      <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-lg font-medium">Loading…</span>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>

        {/* ── Public-only: redirect authenticated users away ─────────────── */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Public pages: anyone can access ───────────────────────────── */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*"          element={<NotFoundPage />} />

        {/* ── Protected: any authenticated user ─────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/posts/new"     element={<CreatePostPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/my-posts"      element={<MyPostsPage />} />

            {/* ── Role-protected: admin only ───────────────────────────── */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}
