// src/pages/auth/RegisterPage.jsx
// Register form. Calls AuthContext.register() which handles the full flow:
//   POST /api/auth/register → GET /api/auth/me → persist → navigate.

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm p-6 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/" className="flex flex-col items-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 16L40 24L38 28L28 22L28 16Z" fill="#e11d48"/>
              <path d="M40 24L48 30L44 34L38 28L40 24Z" fill="#e11d48"/>
              <path d="M28 22L36 28L32 32L24 26L28 22Z" fill="#1d4ed8"/>
              <path d="M24 26L32 32L28 38L20 30L24 26Z" fill="#1d4ed8"/>
              <path d="M20 30L28 38L42 38L46 34L32 32L20 30Z" fill="#1e3a8a"/>
              <path d="M28 44L40 44L44 38L28 38L28 44Z" fill="#1e3a8a"/>
              <path d="M20 44L28 44L28 38L16 38L20 44Z" fill="#1e3a8a"/>
            </svg>
          </Link>
        </div>

        {/* Server / network error banner */}
        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          <div>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={`w-full px-4 py-3.5 rounded-xl border ${
                fieldErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent bg-[#f0f4ff] dark:bg-slate-800'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base`}
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
              className={`w-full px-4 py-3.5 rounded-xl border ${
                fieldErrors.username ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent bg-[#f0f4ff] dark:bg-slate-800'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base`}
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
              className={`w-full px-4 py-3.5 rounded-xl border ${
                fieldErrors.password ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent bg-[#f0f4ff] dark:bg-slate-800'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base font-medium`}
              value={formData.password}
              onChange={handleChange('password')}
              disabled={isSubmitting}
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1 px-1">{fieldErrors.password}</p>}
          </div>

          <div className="pt-2">
            <button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5a4bfa] hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#5a4bfa] hover:text-indigo-700 font-medium transition-colors">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}
