// src/contexts/AuthContext.jsx
// Provides global authentication state and actions to the entire app.
// Handles: session restoration, login, register, logout, multi-tab sync.

import { createContext, useReducer, useEffect, useCallback } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from '../reducers/authReducer';
import { login as loginService, register as registerService, getCurrentUser } from '../services/authService';
import { saveSession, clearSession, getStoredToken, ACCESS_TOKEN_KEY } from '../utils/authStorage';
import { normalizeApiError } from '../utils/apiError';

// ─── Context ───────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // ── Helper: fetch canonical user from /api/auth/me ──────────────────────
  // Returns { user } on success, throws on failure.
  const fetchCanonicalUser = useCallback(async (accessToken) => {
    const data = await getCurrentUser(accessToken);
    // /me returns { user: { id, role, email, username } }
    return data.user;
  }, []);

  // ── Session restoration on mount ────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken();

      // No token in storage → nothing to restore.
      if (!storedToken) {
        dispatch({ type: AUTH_ACTIONS.RESTORE_FAILED });
        return;
      }

      try {
        // Token exists → verify it is still valid by calling /api/auth/me.
        const user = await fetchCanonicalUser(storedToken);
        // Save canonical user back to storage (in case it changed server-side).
        saveSession(storedToken, user);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SUCCESS,
          payload: { accessToken: storedToken, user },
        });
      } catch (err) {
        const normalized = normalizeApiError(err);

        if (normalized.status === 401 || normalized.status === 403) {
          // Token is invalid or expired → clear and go unauthenticated.
          clearSession();
          dispatch({ type: AUTH_ACTIONS.RESTORE_FAILED });
        } else {
          // Network error / server down during restore.
          // We clear the session because we cannot confirm the token is valid.
          // The user will see an error message and can log in again once the
          // network recovers. This is safer than trusting a potentially expired
          // token without server confirmation.
          clearSession();
          dispatch({
            type: AUTH_ACTIONS.RESTORE_NETWORK_ERROR,
            payload: { message: 'Could not connect to the server. Please try logging in again.' },
          });
        }
      }
    };

    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Multi-tab synchronization ────────────────────────────────────────────
  useEffect(() => {
    const handleStorageEvent = async (event) => {
      // Only react to the accessToken key; ignore theme and other keys.
      if (event.key !== ACCESS_TOKEN_KEY) return;

      if (!event.newValue) {
        // Another tab logged out → clear this tab's auth state immediately.
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } else {
        // Another tab logged in → re-validate with /api/auth/me before trusting.
        try {
          const user = await fetchCanonicalUser(event.newValue);
          saveSession(event.newValue, user);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { accessToken: event.newValue, user },
          });
        } catch {
          // If /me fails after cross-tab login, stay unauthenticated safely.
          clearSession();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [fetchCanonicalUser]);

  // ── Login action ─────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      // Step 1: get accessToken from /api/auth/login
      const loginData = await loginService({ email, password });
      const { accessToken } = loginData;

      // Step 2: get canonical user from /api/auth/me
      const user = await fetchCanonicalUser(accessToken);

      // Step 3: persist and update state
      saveSession(accessToken, user);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { accessToken, user },
      });
    } catch (err) {
      // Clean up any partial session.
      clearSession();
      const normalized = normalizeApiError(err);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { message: normalized.message },
      });
      // Re-throw so the page can know login failed.
      throw normalized;
    }
  }, [fetchCanonicalUser]);

  // ── Register action ──────────────────────────────────────────────────────
  const register = useCallback(async (email, username, password) => {
    try {
      // Step 1: create account — response includes accessToken + user
      const registerData = await registerService({ email, username, password });
      const { accessToken } = registerData;
      // refreshToken from register response is intentionally ignored.

      // Step 2: get canonical user shape from /api/auth/me
      const user = await fetchCanonicalUser(accessToken);

      // Step 3: persist and update state
      saveSession(accessToken, user);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { accessToken, user },
      });
    } catch (err) {
      clearSession();
      const normalized = normalizeApiError(err);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { message: normalized.message },
      });
      throw normalized;
    }
  }, [fetchCanonicalUser]);

  // ── Logout action ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    // Local-only logout — no server API call.
    clearSession();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // ── Context value ────────────────────────────────────────────────────────
  const value = {
    // State
    status: authState.status,          // 'initializing' | 'authenticated' | 'unauthenticated'
    user: authState.user,              // { id, role, email, username } or null
    accessToken: authState.accessToken,
    authError: authState.error,        // Normalized error message or null

    // Derived helpers (convenient booleans)
    isInitializing: authState.status === 'initializing',
    isAuthenticated: authState.status === 'authenticated',

    // Actions
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
