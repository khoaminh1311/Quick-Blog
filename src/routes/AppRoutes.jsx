import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

// Lazy loading pages
const HomePage = lazy(() => import('../pages/posts/HomePage'));
const PostDetailPage = lazy(() => import('../pages/posts/PostDetailPage'));
const CreatePostPage = lazy(() => import('../pages/posts/CreatePostPage'));
const MyPostsPage = lazy(() => import('../pages/posts/MyPostsPage'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Simple loading fallback for Suspense
const LoadingFallback = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="flex items-center gap-3 text-indigo-600">
      <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-lg font-medium">Loading...</span>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth routes (no AppLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main routes (with AppLayout) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/my-posts" element={<MyPostsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
