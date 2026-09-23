// src/reducers/authReducer.js
// Manages global authentication state.
// Actions are named explicitly so they are easy to understand and trace.

// ─── Initial state ─────────────────────────────────────────────────────────

/**
 * The app starts in "initializing" to prevent a flash of logged-out UI
 * while the session is being restored from localStorage / /api/auth/me.
 */
export const initialAuthState = {
  status: 'initializing', // 'initializing' | 'authenticated' | 'unauthenticated'
  accessToken: null,
  user: null,
  error: null,
};

// ─── Action type constants ─────────────────────────────────────────────────

export const AUTH_ACTIONS = {
  // Session restoration completed successfully → authenticated
  RESTORE_SUCCESS: 'RESTORE_SUCCESS',

  // Session restoration found no valid token, or /me returned 401 → unauthenticated
  RESTORE_FAILED: 'RESTORE_FAILED',

  // /api/auth/me returned a network error during restore (not a 401)
  // The session might still be valid once the network recovers.
  RESTORE_NETWORK_ERROR: 'RESTORE_NETWORK_ERROR',

  // Login / Register completed and /me was called → authenticated
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',

  // Login / Register API call failed → unauthenticated + error message
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  // User clicked "Log out" → unauthenticated, no API request
  LOGOUT: 'LOGOUT',
};

// ─── Reducer ───────────────────────────────────────────────────────────────

/**
 * @param {typeof initialAuthState} state
 * @param {{ type: string, payload?: any }} action
 */
export function authReducer(state, action) {
  switch (action.type) {

    // Session restored successfully — token + canonical /me user are valid.
    case AUTH_ACTIONS.RESTORE_SUCCESS:
      return {
        status: 'authenticated',
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        error: null,
      };

    // No valid session found on startup (no token, or 401 from /me).
    case AUTH_ACTIONS.RESTORE_FAILED:
      return {
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: null,
      };

    // /me returned a network error during restore (server unreachable).
    // We keep the last known user from localStorage so the UI can show
    // a "connection problem" message without fully logging the user out.
    // The user can retry; a proper 401 from a future request will clear state.
    case AUTH_ACTIONS.RESTORE_NETWORK_ERROR:
      return {
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: action.payload.message,
      };

    // Login or register succeeded and /me returned the canonical user.
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        status: 'authenticated',
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        error: null,
      };

    // Login or register API call failed (wrong credentials, server error, etc.).
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: action.payload.message,
      };

    // Logout — clear everything, no API call.
    case AUTH_ACTIONS.LOGOUT:
      return {
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: null,
      };

    default:
      return state;
  }
}
