// src/utils/authStorage.js
// Centralized localStorage helpers for authentication.
// Only reads/writes accessToken and user.
// Never stores password or refreshToken.

// ─── Storage key constants ─────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

// ─── Read ──────────────────────────────────────────────────────────────────

/**
 * Read the stored access token.
 * Returns null if nothing is stored or localStorage is unavailable.
 * @returns {string | null}
 */
export function getStoredToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Read and parse the stored user object.
 * Returns null if nothing is stored, JSON is invalid, or localStorage is unavailable.
 * @returns {object | null}
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    // JSON.parse failed — stored value is corrupt; treat as no session.
    return null;
  }
}

// ─── Write ─────────────────────────────────────────────────────────────────

/**
 * Persist the access token and user object.
 * Call this after a successful login, register, or session restore.
 * @param {string} accessToken
 * @param {object} user
 */
export function saveSession(accessToken, user) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore write errors (e.g. private/incognito storage limits).
  }
}

// ─── Clear ─────────────────────────────────────────────────────────────────

/**
 * Remove accessToken and user from localStorage.
 * Call this on logout or when a 401 invalidates the current session.
 */
export function clearSession() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore errors.
  }
}

// ─── Export key constants (used by the storage-event listener) ─────────────
export { ACCESS_TOKEN_KEY, USER_KEY };
