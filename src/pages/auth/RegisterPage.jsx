// src/pages/auth/RegisterPage.jsx
// Register form. Calls AuthContext.register() which handles the full flow:
//   POST /api/auth/register → GET /api/auth/me → persist → navigate.

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import quickBlogLogo from '../../components/quick-blog-logo.png';
import Toast from '../../components/common/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // After registration, go to the originally-requested page (or home).
  const from = location.state?.from?.pathname ?? '/';

  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Client-side validation ─────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(formData.email, formData.username, formData.password);
      // Navigate to the original protected route (or home if none).
      navigate(from, { replace: true });
    } catch (err) {
      // err is already a normalized { status, message, data } object.
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change.
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,#070724_0%,#5947f0_48%,#05c7df_100%)] px-4 py-10">
      <Toast message={serverError} onClose={() => setServerError('')} />
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl" noValidate>
        <img
          alt="QuickBlog"
          className="mx-auto mb-8 h-16 object-contain"
          src={quickBlogLogo}
        />

        <div className="space-y-4">
          <div>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={isSubmitting}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1 px-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <input
              id="register-username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={formData.username}
              onChange={handleChange('username')}
              disabled={isSubmitting}
            />
            {fieldErrors.username && <p className="text-red-500 text-xs mt-1 px-1">{fieldErrors.username}</p>}
          </div>

          <div>
            <input
              id="register-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              required
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={formData.password}
              onChange={handleChange('password')}
              disabled={isSubmitting}
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1 px-1">{fieldErrors.password}</p>}
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 h-10 px-4 w-full"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account…</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
