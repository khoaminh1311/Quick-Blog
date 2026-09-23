// src/hooks/useAuth.js
// Convenient hook to consume AuthContext in any component or page.
// Throws a clear error if used outside of AuthProvider.

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Returns the current auth state and actions from AuthContext.
 *
 * Available values:
 *   status         — 'initializing' | 'authenticated' | 'unauthenticated'
 *   user           — { id, role, email, username } or null
 *   accessToken    — JWT string or null
 *   authError      — normalized error message string or null
 *   isInitializing — boolean shorthand for status === 'initializing'
 *   isAuthenticated — boolean shorthand for status === 'authenticated'
 *   login(email, password)          — async, throws on failure
 *   register(email, username, password) — async, throws on failure
 *   logout()                        — synchronous, local-only
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
